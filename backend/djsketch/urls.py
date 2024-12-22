# filepath: /Users/Guested/Documents/GitHub/dj-sketch/backend/djsketch/urls.py
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
)

from audioapp.views import AudioViewSet

router = DefaultRouter()
router.register(r"audio", AudioViewSet, basename="audio")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include((router.urls, "audioapp"))),
    # docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
