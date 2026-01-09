from django.apps import AppConfig


class AConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'a'
    # === 👇 新增这个 ready 方法 👇 ===
    def ready(self):
        # 导入信号文件，使其生效
        import a.signals