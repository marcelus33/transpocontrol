from django.contrib import admin


def register_classes_to_admin(*args_or_iterables):
    for klass in args_or_iterables:
        @admin.register(klass)
        class GenericClassAdmin(admin.ModelAdmin):
            pass