from django.http import JsonResponse
from .models import user
# Create your views here.
def a_view(request):
    return JsonResponse({'msg': 'test',
                         'status': 200
                         })
def get_user(request):
    users = user.objects.all().values('name')
    user_list = list(users)
    return JsonResponse({'users': user_list,
                         'status': 200
                         })