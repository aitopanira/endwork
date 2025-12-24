
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('a/', include('a.urls')),
    path('a/getuser/', include('a.urls')),
]
