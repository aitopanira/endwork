from rest_framework import serializers
from .models import UserInfo, Tag, Galgame, Novel, Post, Review, UserCollection, GalgameCg,Character,NovelVolume, ReadingProgress,MusicPlayer

# 1. 基础 Tag 序列化器
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# 2. 用户信息序列化器
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['id', 'name', 'avatar', 'bio', 'level', 'exp', 'is_signed_today']
        # 密码只写不读，保护安全
        extra_kwargs = {'password': {'write_only': True}}

# === 1. 新增：角色序列化器 ===
class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        # 只返回前端需要的字段
        fields = ['id', 'name', 'cv', 'description', 'avatar']

# 3. CG 序列化器 (用于单独上传或在详情中展示)
class GalgameCgSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalgameCg
        # 修正: 使用 'galgame' 而不是 'galgame_id'，DRF 才能自动处理外键关联
        fields = ['id', 'image_url', 'galgame'] 

# 4. Galgame 序列化器 (核心修改)
class GalgameSerializer(serializers.ModelSerializer):
    # 嵌套显示标签详情 (read_only表示前端通过API创建游戏时，不能直接传标签对象，只能后台加)
    tags = TagSerializer(many=True, read_only=True)
    # 嵌套显示 CG 图片
    cgs = GalgameCgSerializer(many=True, read_only=True)
    characters = CharacterSerializer(many=True, read_only=True)

    class Meta:
        model = Galgame
        fields = '__all__'
class NovelVolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NovelVolume
        fields = ['id', 'title', 'cover', 'release_date','file_url']
# 5. 小说序列化器
class NovelSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    characters = CharacterSerializer(many=True, read_only=True)
    # === 新增这一行：嵌套显示所有卷 ===
    volumes = NovelVolumeSerializer(many=True, read_only=True)
    class Meta:
        model = Novel
        fields = '__all__'

# 6. 帖子序列化器 (修复 Bug)
class PostSerializer(serializers.ModelSerializer):
    # 修正: 这里的变量名必须叫 'author' (小写)，因为你的 Model 里定义的字段就叫 author
    author = UserInfoSerializer(read_only=True) 
    
    class Meta:
        model = Post
        fields = '__all__'

# 7. 评论序列化器
class ReviewSerializer(serializers.ModelSerializer):
    # 显示用户详细信息
    user = UserInfoSerializer(read_only=True)
    user_id=serializers.PrimaryKeyRelatedField(
        queryset=UserInfo.objects.all(), 
        source='user', # 指向模型里的 user 字段
        write_only=True
    )
    class Meta:
        model = Review
        fields = '__all__'

# 8. 收藏序列化器
class UserCollectionSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer(read_only=True)
    
    class Meta:
        model = UserCollection
        fields = '__all__'



class ReadingProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingProgress
        fields = ['id', 'user', 'volume', 'cfi', 'updated_at']
        read_only_fields = ['user', 'updated_at'] 
        # user 字段是只读的，因为我们会从 request.user (或者你的自定义认证) 中获取并自动赋值

class MusicPlayerSerializer(serializers.ModelSerializer):
    # 1. 改名映射：把 singer 映射给 artist
    artist = serializers.CharField(source='singer', read_only=True)
    # 2. 改名映射：把 music_urls 映射给 url
    url = serializers.CharField(source='music_urls', read_only=True)
    # 3. 封面：因为我们要前端自己解析，所以这里不用返回 cover 字段，或者返回个空
    # 前端 store 代码里发现没有 cover 会自动去解析的
    class Meta:
        model = MusicPlayer
        # 返回给前端的字段列表
        fields = '__all__'