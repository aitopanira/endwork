from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
# 1. 引入所有模型
from .models import UserInfo, Galgame, Novel, Post, Review, UserCollection, Tag
# 2. 引入所有序列化器
from .serializers import (
    UserInfoSerializer, GalgameSerializer, NovelSerializer, 
    PostSerializer, ReviewSerializer, UserCollectionSerializer, TagSerializer
)

# === 用户视图 ===
class UserViewSet(viewsets.ModelViewSet):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer

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
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

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