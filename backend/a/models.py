from django.db import models
from django.utils import timezone
# 1. 用户信息表
# 扩展了基础用户功能，增加了头像、等级、经验值等二次元社区必备字段
class UserInfo(models.Model):
    name = models.CharField(max_length=50, verbose_name="昵称")
    password = models.CharField(max_length=100)  # 实际开发建议使用 Django 自带的 User 或加密存储
    avatar = models.URLField(default='https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', verbose_name="头像")
    bio = models.TextField(blank=True, default='这个人很懒，什么都没有写~', verbose_name="个性签名")
    level = models.IntegerField(default=1, verbose_name="等级")
    exp = models.IntegerField(default=0, verbose_name="经验值")
    is_signed_today = models.BooleanField(default=False, verbose_name="今日是否签到")

    def __str__(self):
        return self.name 

# 2. 通用标签表 (多对多关联)
class Tag(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

# 3. Galgame 资料表
class Galgame(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    original_title = models.CharField(max_length=200, blank=True, verbose_name="原名")
    developer = models.CharField(max_length=100, verbose_name="开发商")
    release_date = models.DateField(null=True, blank=True, verbose_name="发售日期")
    price = models.CharField(max_length=50, blank=True, verbose_name="价格")
    description = models.TextField(verbose_name="剧情简介")
    cover = models.URLField(verbose_name="封面图链接")
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="标签")
    
    # 缓存字段：用于首页“最新评分”排序，实际评分通过 Review 表计算更新
    score_avg = models.FloatField(default=0.0, verbose_name="平均评分")
    views = models.IntegerField(default=0, verbose_name="浏览量")

    def __str__(self):
        return self.title
    
class GalgameCg(models.Model):
    galgame = models.ForeignKey(Galgame, on_delete=models.CASCADE, related_name='cgs',verbose_name="所属Galgame")
    image_url = models.URLField(verbose_name="CG图片链接")

    def __str__(self):
        return f"{self.galgame.title}的 CG"

# 4. 轻小说 资料表
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
    novel = models.ForeignKey(
        Novel, 
        on_delete=models.CASCADE, 
        related_name='volumes', # 反向查询名称，很重要！
        verbose_name="所属小说"
    )
    title = models.CharField(max_length=200, verbose_name="卷名") # 如 "第一卷 败犬女主太多了"
    cover = models.URLField(max_length=500, blank=True, null=True, verbose_name="本卷封面")
    release_date = models.DateField(blank=True, null=True, verbose_name="发售日")

    def __str__(self):
        return f"{self.novel.title} - {self.title}"
# 5. 社区帖子表
class Post(models.Model):
    author = models.ForeignKey(UserInfo, on_delete=models.CASCADE, verbose_name="作者")
    title = models.CharField(max_length=200, verbose_name="标题")
    summary = models.TextField(max_length=500, verbose_name="摘要")
    content = models.TextField(verbose_name="正文")
    cover = models.URLField(null=True, blank=True, verbose_name="封面图")
    category = models.CharField(max_length=20, default='闲聊', verbose_name="分类") # 如: 资讯, 闲聊, 攻略
    created_at = models.DateTimeField(default=timezone.now, verbose_name="发布时间")
    views = models.IntegerField(default=0, verbose_name="阅读数")
    likes = models.IntegerField(default=0, verbose_name="点赞数")

    def __str__(self):
        return self.title

# 6. 统一评论与评分表 (核心联动)
# 一个表解决 Galgame、小说、帖子的评论
class Review(models.Model):
    TARGET_CHOICES = [
        ('galgame', 'Galgame'),
        ('novel', 'Novel'),
        ('post', 'Post'),
    ]
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    
    # 复合索引：指明评论的是哪个类型的哪个ID
    target_type = models.CharField(max_length=10, choices=TARGET_CHOICES) 
    target_id = models.IntegerField() 
    
    content = models.TextField(verbose_name="评论内容")
    score = models.FloatField(default=0, verbose_name="评分") # 0表示未打分
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['target_type', 'target_id']),
        ]

# 7. 用户书架/收藏状态表 (核心联动)
# 记录：想玩、在玩、玩过、收藏、已读
class UserCollection(models.Model):
    STATUS_CHOICES = [
        ('wish', '想玩'),      # Galgame用
        ('playing', '在玩'),   # Galgame用
        ('played', '玩过'),    # Galgame用
        ('fav', '收藏'),       # 小说/帖子用
        ('read', '已读'),      # 小说用
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
        unique_together = ('user', 'target_type', 'target_id', 'status') # 联合主键，防止重复标记同一种状态


class Character(models.Model):
    # 1. 修改 Galgame 外键：加上 null=True, blank=True，允许为空
    galgame = models.ForeignKey(
        'Galgame', 
        on_delete=models.CASCADE, 
        related_name='characters', 
        verbose_name="所属Galgame",
        null=True,   # 允许数据库存空值
        blank=True   # 允许后台表单不填
    )

    # 2. 新增 Novel 外键：关联轻小说
    novel = models.ForeignKey(
        'Novel', 
        on_delete=models.CASCADE, 
        related_name='characters', 
        verbose_name="所属轻小说",
        null=True, 
        blank=True
    )

    name = models.CharField(max_length=100, verbose_name="角色名")
    cv = models.CharField(max_length=50, blank=True, verbose_name="声优(CV)") # 小说广播剧也有CV，保留即可
    description = models.TextField(verbose_name="角色介绍")
    avatar = models.URLField(verbose_name="立绘图片链接")

    def __str__(self):
        # 显示时判断是属于哪边的
        if self.galgame:
            return f"[Gal] {self.galgame.title} - {self.name}"
        elif self.novel:
            return f"[Novel] {self.novel.title} - {self.name}"
        return self.name
