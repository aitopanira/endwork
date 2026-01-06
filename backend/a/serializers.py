from rest_framework import serializers
from .models import UserInfo, Tag, Galgame, Novel, Post,Review, UserCollection

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['id','name','avatar','bio','level','exp','is_signed_today']

class GalgameSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = Galgame
        fields = '__all__'
class NovelSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = Novel
        fields = '__all__'
class PostSerializer(serializers.ModelSerializer):
    Author = UserInfoSerializer(read_only=True)
    class Meta:
        model = Post
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    class Meta:
        model = Review
        fields = '__all__'
class UserCollectionSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    class Meta:
        model = UserCollection
        fields = '__all__'