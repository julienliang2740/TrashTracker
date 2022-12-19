from django.urls import path
from . import views

urlpatterns = [
    path("map",views.index, name = "index"),
    path("", views.splash, name = "splash")
]