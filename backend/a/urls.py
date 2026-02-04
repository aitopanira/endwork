from django.urls import path, include
from rest_framework.routers import DefaultRouter
# 引入所有视图，包括 TagViewSet
from .views import (
    UserViewSet, GalgameViewSet, NovelViewSet, 
    PostViewSet, ReviewViewSet, UserCollectionViewSet, TagViewSet,ReadingProgressViewSet,MusicViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tags', TagViewSet)       # <--- 确保这一行存在
router.register(r'galgames', GalgameViewSet)
router.register(r'novels', NovelViewSet)
router.register(r'posts', PostViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'collections', UserCollectionViewSet)
router.register(r'progress', ReadingProgressViewSet, basename='progress')
router.register(r'music', MusicViewSet,basename='music')
urlpatterns = [
    path('', include(router.urls)),
]