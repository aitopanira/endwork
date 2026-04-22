import os
import uuid
from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# 1. 引入所有模型
from .models import UserInfo, Galgame, Novel, Post, Review, UserCollection, Tag,ReadingProgress,MusicPlayer
from django.core.files.storage import default_storage
# 2. 引入所有序列化器
from .serializers import (
    UserInfoSerializer, GalgameSerializer, NovelSerializer, 
    PostSerializer, ReviewSerializer, UserCollectionSerializer, TagSerializer,
    ReadingProgressSerializer,MusicPlayerSerializer
)
import random

# === 用户视图 ===
class UserViewSet(viewsets.ModelViewSet):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
   # === 👇 新增这个签到接口 👇 ===
    @action(detail=False, methods=['post'])
    def sign_in(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'status': 'error', 'msg': '用户ID不能为空'}, status=400)
        
        try:
            user = UserInfo.objects.get(id=user_id)
        except UserInfo.DoesNotExist:
            return Response({'status': 'error', 'msg': '用户不存在'}, status=404)

        if user.is_signed_today:
             return Response({'status': 'warning', 'msg': '今天已经签到过了哦~'})

        # 增加经验
        exp_gain = random.randint(10, 50)
        user.exp += exp_gain
        user.is_signed_today = True
        
        msg = f"签到成功！经验 +{exp_gain}"

        # 升级逻辑
        next_level_exp = int(100 * (1.2 ** (user.level - 1)))
        while user.exp >= next_level_exp:
            user.exp -= next_level_exp
            user.level += 1
            msg += f"，恭喜升级到 Lv.{user.level}！"
            next_level_exp = int(100 * (1.2 ** (user.level - 1)))

        user.save() # 保存到数据库

        serializer = self.get_serializer(user)
        return Response({
            'status': 'success', 
            'msg': msg, 
            'user': serializer.data
        })
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        user, created = UserInfo.objects.get_or_create(name=username)
        serializer = self.get_serializer(user)
        return Response({'status': 'success', 'user': serializer.data})
    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('nickname')
        password= request.data.get('password')
        # 2. 检查必填字段
        if not username or not password:
            return Response({'status': 'error', 'msg': '用户名或者密码不能为空'}, status=400)
        # 3. 检查用户名是否已存在
        if UserInfo.objects.filter(name=username).exists():
            return Response({'status': 'error', 'msg': '该昵称已被占用，请换一个'}, status=400)
        # 4. 创建新用户
        new_user = UserInfo.objects.create(
            name=username,
            password=password, # ⚠️ 实际生产环境请使用 make_password(password) 加密存储
            level=1,
            exp=0,
            bio="萌新报到！"
        )
        return Response({'status': 'success', 'msg': '注册成功，请去登录', 'username': new_user.name})

# === 标签视图 (之前报错缺失的部分) ===
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# === Galgame 视图 ===
class GalgameViewSet(viewsets.ModelViewSet):
    queryset = Galgame.objects.all().order_by('-release_date')
    serializer_class = GalgameSerializer

# === 轻小说视图 ===
class NovelViewSet(viewsets.ModelViewSet):
    queryset = Novel.objects.all()
    serializer_class = NovelSerializer

# === 帖子视图 ===
from django.core.files.storage import default_storage # 引入 Django 存储引擎

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # 👇 新增这个方法：让接口支持按作者过滤
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-id') # 默认按最新发布倒序排列
        
        # 尝试从请求 URL 中获取 author 参数，例如 /a/posts/?author=6
        author_id = self.request.query_params.get('author', None)
        if author_id is not None:
            # 如果传了作者ID，就只返回该作者的文章
            queryset = queryset.filter(author_id=author_id)
            
        return queryset

    def perform_create(self, serializer):
        # 1. 尝试获取前端传来的作者 ID
        author_id = self.request.data.get('author')
        
        # 🚨 终极防线：如果在这一步没拿到 author_id，立刻拦截！
        # 不要让它去碰数据库（避免引发 500 崩溃），而是直接扔回一个 400 错误给前端
        if not author_id or author_id == 'undefined' or author_id == 'null':
            raise ValidationError({
                "author": "后端没有收到有效的作者 ID！请检查前端 userStore.userInfo 是否包含了正确的 id 属性。"
            })

        # 2. 处理图片逻辑（保持不变，已经很完美了）
        cover_file = self.request.FILES.get('cover_file') 
        cover_url = ""

        if cover_file:
            ext = os.path.splitext(cover_file.name)[1]  
            safe_filename = f"{uuid.uuid4().hex}{ext}"  
            file_path = f"post_covers/{safe_filename}"

            saved_path = default_storage.save(file_path, cover_file)
            full_url = default_storage.url(saved_path)
            
            if '?' in full_url:
                full_url = full_url.split('?')[0]
                
            cover_url = full_url
        else:
            cover_url = self.request.data.get('cover', '')

        # 3. 强制带着校验过的 author_id 和图片链接保存
        serializer.save(author_id=author_id, cover=cover_url)
# === 评论视图 ===
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        t_type = self.request.query_params.get('target_type')
        t_id = self.request.query_params.get('target_id')
        if t_type and t_id:
            queryset = queryset.filter(target_type=t_type, target_id=t_id)
        return queryset

# === 用户收藏视图 ===
class UserCollectionViewSet(viewsets.ModelViewSet):
    queryset = UserCollection.objects.all()
    serializer_class = UserCollectionSerializer

    def get_queryset(self):
        queryset = UserCollection.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class ReadingProgressViewSet(viewsets.ModelViewSet):

    queryset = ReadingProgress.objects.all()
    serializer_class = ReadingProgressSerializer
    # 确保只有登录用户能访问
    permission_classes = [IsAuthenticated] 

    # 辅助函数：获取当前登录用户的 UserInfo 实例
    def get_user_info(self):
        # 假设你的 UserInfo 和 Django 的 User 是通过 username/name 或者 ID 关联的
        # 这里需要根据你实际的登录逻辑调整。
        # 如果你的 request.user 就是 UserInfo (自定义Auth)，直接用 request.user
        # 如果 request.user 是 django User，我们需要查 UserInfo
        try:
            # 方案A: 如果两者名字一样
            return UserInfo.objects.get(name=self.request.user.username)
        except UserInfo.DoesNotExist:
            # 方案B: 如果没关联，暂时为了跑通，我们返回第一个用户或者报错
            # ⚠️ 实际项目中，你需要确保 request.user 能找到对应的 UserInfo
            return UserInfo.objects.first() 

    # 1. 同步进度 (POST /a/progress/sync/)
    @action(detail=False, methods=['post'])
    def sync(self, request):
        volume_id = request.data.get('volume_id')
        cfi = request.data.get('cfi')
        
        # 这一步是为了获取你在 UserInfo 表里的用户对象
        # 前端 userStore 应该存了 user_id，你也可以从前端传 user_id 过来
        # 这里为了简单，我们假设前端传了 user_id
        user_id = request.data.get('user_id') 
        
        if not user_id:
            # 如果没传，尝试从登录态获取 (见上面的 get_user_info)
            user_info = self.get_user_info()
        else:
            user_info = UserInfo.objects.get(id=user_id)

        if not volume_id or not cfi:
            return Response({'error': '缺少参数'}, status=status.HTTP_400_BAD_REQUEST)

        # 更新或创建进度
        progress, created = ReadingProgress.objects.update_or_create(
            user=user_info,
            volume_id=volume_id,
            defaults={'cfi': cfi}
        )
        
        return Response({
            'status': 'success', 
            'cfi': progress.cfi,
            'updated_at': progress.updated_at
        })

    # 2. 查询进度 (GET /a/progress/query/?volume_id=1&user_id=1)
    @action(detail=False, methods=['get'])
    def query(self, request):
        volume_id = request.query_params.get('volume_id')
        user_id = request.query_params.get('user_id') # 前端记得传

        if not user_id:
             user_info = self.get_user_info()
        else:
             try:
                user_info = UserInfo.objects.get(id=user_id)
             except UserInfo.DoesNotExist:
                return Response({'cfi': None})

        try:
            progress = ReadingProgress.objects.get(user=user_info, volume_id=volume_id)
            return Response({'cfi': progress.cfi})
        except ReadingProgress.DoesNotExist:
            return Response({'cfi': None}) # 没读过，返回空
# === 标签视图 (之前报错缺失的部分) ===

class MusicViewSet(viewsets.ModelViewSet):
    queryset = MusicPlayer.objects.all()
    serializer_class = MusicPlayerSerializer


# === 用户收藏视图 ===
class UserCollectionViewSet(viewsets.ModelViewSet):
    queryset = UserCollection.objects.all()
    serializer_class = UserCollectionSerializer

    def get_queryset(self):
        queryset = UserCollection.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    # 👇 修复：通过 @action 注册 /collections/status/ (GET 请求)
    @action(detail=False, methods=['get'])
    def status(self, request):
        user_id = request.query_params.get('user_id')
        target_type = request.query_params.get('target_type')
        target_id = request.query_params.get('target_id')

        if not user_id:
            return Response({"status": None})

        collection = UserCollection.objects.filter(
            user_id=user_id, 
            target_type=target_type, 
            target_id=target_id
        ).first()

        if collection:
            return Response({"status": collection.status})
        return Response({"status": None})

    # 👇 修复：通过 @action 注册 /collections/toggle/ (POST 请求)
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        user_id = request.data.get('user_id')
        target_type = request.data.get('target_type')
        target_id = request.data.get('target_id')
        # 变量命名为 status_val 避免与 rest_framework 的 status 模块冲突
        status_val = request.data.get('status') 

        try:
            user = UserInfo.objects.get(id=user_id)
        except UserInfo.DoesNotExist:
            return Response({"error": "用户不存在"}, status=status.HTTP_404_NOT_FOUND)

        # 核心逻辑：先删除该用户对该目标的所有旧状态
        UserCollection.objects.filter(
            user=user,
            target_type=target_type,
            target_id=target_id
        ).delete()

        # 核心逻辑：如果前端传来的不是 'none'（取消），则创建新状态
        if status_val != 'none':
            UserCollection.objects.create(
                user=user,
                target_type=target_type,
                target_id=target_id,
                status=status_val
            )
            return Response({"message": "状态已更新", "status": status_val})
            
        return Response({"message": "状态已取消", "status": ""})