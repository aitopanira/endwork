from django.db import models
from django.utils import timezone

# 1. 用户信息表
class UserInfo(models.Model):
    name = models.CharField(max_length=50, verbose_name="昵称")
    # 注意：生产环境强烈建议改为继承 AbstractUser，这里保留原样以防破坏你现有的登录逻辑
    password = models.CharField(max_length=100)  
    avatar = models.URLField(default='https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', verbose_name="头像")
    bio = models.TextField(blank=True, default='这个人很懒，什么都没有写~', verbose_name="个性签名")
    level = models.IntegerField(default=1, verbose_name="等级")
    exp = models.IntegerField(default=0, verbose_name="经验值")
    is_signed_today = models.BooleanField(default=False, verbose_name="今日是否签到")

    def __str__(self):
        return self.name 

# 2. 通用标签表
class Tag(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

# 3. Galgame 资料表 (保持不变)
class Galgame(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    original_title = models.CharField(max_length=200, blank=True, verbose_name="原名")
    developer = models.CharField(max_length=100, verbose_name="开发商")
    release_date = models.DateField(null=True, blank=True, verbose_name="发售日期")
    price = models.CharField(max_length=50, blank=True, verbose_name="价格")
    description = models.TextField(verbose_name="剧情简介")
    cover = models.URLField(verbose_name="封面图链接")
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="标签")
    
    score_avg = models.FloatField(default=0.0, verbose_name="平均评分")
    views = models.IntegerField(default=0, verbose_name="浏览量")

    def __str__(self):
        return self.title
    
class GalgameCg(models.Model):
    galgame = models.ForeignKey(Galgame, on_delete=models.CASCADE, related_name='cgs', verbose_name="所属Galgame")
    image_url = models.URLField(verbose_name="CG图片链接")

    def __str__(self):
        return f"{self.galgame.title}的 CG"

# 4. 轻小说 资料表 (保持不变)
class Novel(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    original_title = models.CharField(max_length=200, blank=True, verbose_name="原名")
    author = models.CharField(max_length=100, verbose_name="作者")
    illustrator = models.CharField(max_length=100, blank=True, verbose_name="插画")
    publisher = models.CharField(max_length=100, blank=True, verbose_name="出版社")
    status = models.CharField(max_length=20, default='连载中', verbose_name="连载状态")
    description = models.TextField(verbose_name="简介")
    cover = models.URLField(verbose_name="封面图链接")
    tags = models.ManyToManyField(Tag, blank=True)
    
    score_avg = models.FloatField(default=0.0, verbose_name="平均评分")
    views = models.IntegerField(default=0, verbose_name="浏览量")

    def __str__(self):
        return self.title

class NovelVolume(models.Model):
    novel = models.ForeignKey(Novel, on_delete=models.CASCADE, related_name='volumes', verbose_name="所属小说")
    title = models.CharField(max_length=200, verbose_name="卷名") 
    cover = models.URLField(max_length=500, blank=True, null=True, verbose_name="本卷封面")
    release_date = models.DateField(blank=True, null=True, verbose_name="发售日")

    def __str__(self):
        return f"{self.novel.title} - {self.title}"

# 5. 资讯/文章表 (原 Post 表，已修改)
# 修改说明：从“社区帖子”转变为“CMS资讯”，删除了闲聊属性，增加了置顶功能
class Post(models.Model):
    # 分类限制为资讯类
    CATEGORY_CHOICES = [
        ('gal_news', 'Galgame资讯'),
        ('gal_review', 'Galgame点评'),
        ('novel_news', '轻小说资讯'),
        ('novel_review', '轻小说点评'),
    ]

    author = models.ForeignKey(UserInfo, on_delete=models.CASCADE, verbose_name="发布者")
    title = models.CharField(max_length=200, verbose_name="标题")
    summary = models.TextField(max_length=500, verbose_name="摘要", help_text="用于首页显示的简短介绍")
    content = models.TextField(verbose_name="正文内容") # 建议前端使用富文本编辑器
    cover = models.URLField(null=True, blank=True, verbose_name="封面图")
    
    # 修改了这里：默认分类改为 news，且选项不再包含“闲聊”
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='news', verbose_name="资讯分类")
    
    # 新增：置顶功能（新闻常用）
    is_pinned = models.BooleanField(default=False, verbose_name="是否置顶")
    
    created_at = models.DateTimeField(default=timezone.now, verbose_name="发布时间")
    views = models.IntegerField(default=0, verbose_name="阅读数")
    likes = models.IntegerField(default=0, verbose_name="点赞数")

    class Meta:
        verbose_name = "资讯文章"
        verbose_name_plural = verbose_name
        ordering = ['-is_pinned', '-created_at'] # 默认优先显示置顶，然后按时间倒序

    def __str__(self):
        return self.title

# 6. 统一评论与评分表
# 保留了对 Post 的关联，因为新闻也可以有评论
class Review(models.Model):
    TARGET_CHOICES = [
        ('galgame', 'Galgame'),
        ('novel', 'Novel'),
        ('post', 'Post'), # 修改显示名称
    ]
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    
    target_type = models.CharField(max_length=10, choices=TARGET_CHOICES) 
    target_id = models.IntegerField() 
    
    content = models.TextField(verbose_name="评论内容")
    score = models.FloatField(default=0, verbose_name="评分")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['target_type', 'target_id']),
        ]
        verbose_name = "评论/评分"

# 7. 用户书架/收藏状态表
class UserCollection(models.Model):
    STATUS_CHOICES = [
        ('wish', '想玩'),       # Galgame
        ('playing', '在玩'),    # Galgame
        ('played', '玩过'),     # Galgame
        ('fav', '收藏'),        # 小说/资讯通用
        ('read', '已读'),       # 小说通用
    ]
    TARGET_CHOICES = [
        ('galgame', 'Galgame'),
        ('novel', 'Novel'),
        ('post', 'Post'),
    ]

    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    target_type = models.CharField(max_length=10, choices=TARGET_CHOICES)
    target_id = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'target_type', 'target_id', 'status')

# 8. 角色表 (保持不变)
class Character(models.Model):
    galgame = models.ForeignKey(
        'Galgame', 
        on_delete=models.CASCADE, 
        related_name='characters', 
        verbose_name="所属Galgame",
        null=True, 
        blank=True 
    )

    novel = models.ForeignKey(
        'Novel', 
        on_delete=models.CASCADE, 
        related_name='characters', 
        verbose_name="所属轻小说",
        null=True, 
        blank=True
    )

    name = models.CharField(max_length=100, verbose_name="角色名")
    cv = models.CharField(max_length=50, blank=True, verbose_name="声优(CV)")
    description = models.TextField(verbose_name="角色介绍")
    avatar = models.URLField(verbose_name="立绘图片链接")

    def __str__(self):
        if self.galgame:
            return f"[Gal] {self.galgame.title} - {self.name}"
        elif self.novel:
            return f"[Novel] {self.novel.title} - {self.name}"
        return self.name