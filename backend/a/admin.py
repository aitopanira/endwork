from django.contrib import admin
# 导入所有新定义的模型
from .models import UserInfo, Tag, Galgame, Novel, Post, Review, UserCollection, GalgameCg,Character,NovelVolume

# 注册模型到后台，这样你就可以在 http://127.0.0.1:8000/admin/ 里管理数据了
admin.site.register(UserInfo)
admin.site.register(Tag)
# admin.site.register(Galgame)
# admin.site.register(Novel)
admin.site.register(Post)
admin.site.register(Review)
admin.site.register(UserCollection)

class GalgameCgInline(admin.TabularInline):
    model = GalgameCg
    extra = 12  # 默认多出几行供添加新CG
# 1. 定义 Galgame 专用的角色块 (隐藏 novel 选项)
class GalgameCharacterInline(admin.StackedInline):
    model = Character
    extra = 1
    exclude = ('novel',) 
class NovelCharacterInline(admin.StackedInline):
    model = Character
    extra = 1
    exclude = ('galgame',)
class NovelVolumeInline(admin.TabularInline):
    model = NovelVolume
    extra = 1 # 默认多显示一行空格供填写
@admin.register(Galgame)
class GalgameAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'developer', 'score_avg', 'release_date', 'views')
    inlines = [GalgameCgInline ,GalgameCharacterInline]
@admin.register(Novel)
class NovelAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'original_title', 'author', 'status', 'score_avg')
    search_fields = ('title', 'original_title','author')
    # 关键：把角色管理块加到轻小说编辑页
    inlines = [NovelCharacterInline,NovelVolumeInline]
    
