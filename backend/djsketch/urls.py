from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView

from audioapp.views import (
    AudioFileViewSet,
    AudioManipulationViewSet,
    PlayHistoryGetView,
)

router = DefaultRouter()
router.register(r"audio", AudioFileViewSet, basename="audio")
router.register(r"manipulate", AudioManipulationViewSet, basename="manipulate")
router.register(r"history", PlayHistoryGetView, basename="history")

urlpatterns = router.urls
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

    # Serve media files during development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
