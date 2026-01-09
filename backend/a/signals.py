# backend/a/signals.py

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
# 👇 1. 记得导入 Novel 模型
from .models import Review, Galgame, Novel

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_item_score(sender, instance, **kwargs):
    print(f"⚡ [信号触发] 评论变动检测 - 类型: {instance.target_type}, ID: {instance.target_id}")

    # === 分支 A: 处理 Galgame ===
    if instance.target_type in ['galgame', 'game', 'Galgame']:
        try:
            game = Galgame.objects.get(id=instance.target_id)
            
            # 筛选对应的评论
            reviews = Review.objects.filter(target_type=instance.target_type, target_id=instance.target_id)
            # 计算平均分
            avg_result = reviews.aggregate(Avg('score'))['score__avg']
            # 保留1位小数
            new_score = round(avg_result, 1) if avg_result is not None else 0.0
            
            game.score_avg = new_score
            game.save()
            print(f"🎮 [成功] Galgame(ID:{game.id}) 评分已更新为: {game.score_avg}")

        except Galgame.DoesNotExist:
            print(f"❌ [错误] 找不到 Galgame ID: {instance.target_id}")
        except Exception as e:
            print(f"❌ [异常] Galgame 更新失败: {e}")

    # === 分支 B: 处理 轻小说 (新增) ===
    elif instance.target_type in ['novel', 'book', 'lightnovel']:
        try:
            # 1. 找到轻小说对象
            novel = Novel.objects.get(id=instance.target_id)
            
            # 2. 筛选对应的评论 (注意：确保你的前端发评论时 target_type 传的是 'novel' 或 'book')
            reviews = Review.objects.filter(target_type=instance.target_type, target_id=instance.target_id)
            
            # 3. 计算平均分
            avg_result = reviews.aggregate(Avg('score'))['score__avg']
            new_score = round(avg_result, 1) if avg_result is not None else 0.0
            
            # 4. 更新字段
            novel.score_avg = new_score
            novel.save()
            print(f"📚 [成功] 轻小说(ID:{novel.id}) 评分已更新为: {novel.score_avg}")

        except Novel.DoesNotExist:
            print(f"❌ [错误] 找不到 Novel ID: {instance.target_id}")
        except Exception as e:
            print(f"❌ [异常] Novel 更新失败: {e}")
    
    else:
        print(f"⚠️ [跳过] 未知的 target_type: {instance.target_type}")