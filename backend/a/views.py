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

# === 标签视图 (之前报错缺失的部分) ===
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

# === Galgame 视图 ===
class GalgameViewSet(viewsets.ModelViewSet):
    queryset = Galgame.objects.all()
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
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
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