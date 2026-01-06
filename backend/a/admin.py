from django.contrib import admin
# 导入所有新定义的模型
from .models import UserInfo, Tag, Galgame, Novel, Post, Review, UserCollection

# 注册模型到后台，这样你就可以在 http://127.0.0.1:8000/admin/ 里管理数据了
admin.site.register(UserInfo)
admin.site.register(Tag)
admin.site.register(Galgame)
admin.site.register(Novel)
admin.site.register(Post)
admin.site.register(Review)
admin.site.register(UserCollection)