import os
import pytest
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djsketch.settings")
django.setup()


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass