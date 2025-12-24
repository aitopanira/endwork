from django.urls import path
from .views import a_view
from .views import get_user

urlpatterns = [
    path('a/', a_view),
    path('getuser/', get_user),
]
