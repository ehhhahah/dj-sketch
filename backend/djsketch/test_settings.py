import os

from .settings import *

# Override MEDIA_ROOT for tests
MEDIA_ROOT = os.path.join(BASE_DIR, "uploads_test")
# Override DEBUG for tests
DEBUG = False
# Override DATABASES for tests
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}
# Override DEBUG_TOOLBAR_CONFIG for tests
DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": lambda request: False}
