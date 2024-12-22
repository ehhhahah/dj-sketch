import os
import sys
import pytest
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djsketch.settings")
django.setup()


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass
