from dj_rest_auth.views import LoginView
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.db.models import ProtectedError
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from users.permissions import IsAdmin
from users.serializers import ChangePasswordSerializer, ResetPasswordConfirmSerializer, SendResetLinkSerializer, \
    GroupSerializer, UserListSerializer, GroupCreateSerializer, PermissionSerializer
from users.serializers import UserManagementSerializer
from utils.utils import get_user_by_uidb64, get_and_validate_serializer, PermissionClassByActionMixin, \
    SerializerClassByActionMixin, may_fail
from utils.utils.email import send_email_with_template
from utils.utils.pagination import CustomPageSizePagination
from utils.utils.reset_url_link import generate_reset_url

User = get_user_model()


@extend_schema(tags=['Users Groups'])
@extend_schema_view(
    create=extend_schema(
        description="Endpoint to create a group",
        request=GroupCreateSerializer
    ),
    update=extend_schema(
        description="Endpoint to update a group.",
        request=GroupCreateSerializer
    ),
    partial_update=extend_schema(
        description="Endpoint to update a group.",
        request=GroupCreateSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a group.",
        request=GroupSerializer
    ),
    list=extend_schema(
        description="Endpoint to list all groups.",
        request=GroupSerializer
    ),
)
class GroupViewSet(ModelViewSet, SerializerClassByActionMixin):
    """
    ViewSet to manage User Groups.
    """
    permission_classes = [IsAdmin]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = None
    action_serializers = {
        'create': GroupCreateSerializer,
        'update': GroupCreateSerializer,
        'partial_update': GroupCreateSerializer,
        'retrieve': GroupSerializer,
        'list': GroupSerializer,
    }


@extend_schema(tags=['Users Groups'])
class PermissionViewSet(GenericViewSet, ListModelMixin):
    """
    ViewSet to show all groups
    """
    permission_classes = [IsAdmin]
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    pagination_class = None


@extend_schema(tags=['Users'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all users.", request=UserListSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single user.", request=UserListSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new users.",
        request=UserManagementSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update users.",
        request=UserManagementSerializer,
    ),
)
class UserViewSet(
    PermissionClassByActionMixin,
    SerializerClassByActionMixin,
    ModelViewSet
):
    """
    ViewSet for managing User objects.
    """
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'email']
    action_permissions = {
        'create': [IsAdmin],
        'retrieve': [IsAdmin],
        'update': [IsAdmin],
        'partial_update': [IsAdmin],
        'destroy': [IsAdmin],
        'list': [IsAdmin],
    }
    action_serializers = {
        'create': UserManagementSerializer,
        'update': UserManagementSerializer,
        'partial_update': UserManagementSerializer,
        'list': UserListSerializer,
        'retrieve': UserListSerializer,
    }

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response()

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        return Response()

    @may_fail(ProtectedError, 'This user cannot be deleted, it is related to other entities')
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomLoginView(LoginView):
    """
    Custom login that cheks if user is active
    """

    @extend_schema(
        methods=['POST'],
        request={
            'application/x-www-form-urlencoded': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string', 'format': 'email', 'description': 'User email'},
                    'password': {'type': 'string', 'format': 'password', 'description': 'User password'}
                },
                'required': ['email', 'password']
            }
        },
        tags=['Authentication']
    )
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Invalid email or password. Please try again."}, status=HTTP_404_NOT_FOUND)
        #
        if not user.is_active:
            return Response("The account has been removed", status=status.HTTP_400_BAD_REQUEST)
        #
        if user.change_password_next_login:
            return Response("Your password has expired. Please reset your password.",
                            status=status.HTTP_400_BAD_REQUEST)
        # Check if password has expired based on password expiry settings
        if not user.password_never_expires and user.password_expiry_days:
            days_since_last_change = (timezone.now() - user.last_password_change).days
            if days_since_last_change >= user.password_expiry_days:
                return Response("Your password has expired. Please reset your password.",
                                status=status.HTTP_400_BAD_REQUEST)
        #
        return super().post(request, *args, **kwargs)


class PasswordViewset(GenericViewSet):

    def get_serializer_class(self):
        match self.action:
            case 'reset':
                return ResetPasswordConfirmSerializer
            case 'change':
                return ChangePasswordSerializer
            case 'send_reset_link':
                return SendResetLinkSerializer

    @action(detail=False, methods=['post'])
    @get_and_validate_serializer
    def reset(self, request, serializer, *args, **kwargs):
        user = get_user_by_uidb64(serializer.data['uidb64'])
        user.set_password(serializer.data['new_password'])
        user.change_password_next_login = False
        user.save()
        return Response()

    @action(detail=False, methods=['post'])
    @get_and_validate_serializer
    def change(self, request, serializer, *args, **kwargs):
        self.request.user.set_password(serializer.data['new_password'])
        self.request.user.save()
        return Response()

    @action(detail=False, methods=['post'], url_path='send-reset-link')
    @get_and_validate_serializer
    def send_reset_link(self, request, serializer, *args, **kwargs):
        email = self.request.data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            send_email_with_template(
                subject=f'Reset password email',
                email=user.email,
                template_to_load='emails/forgot_password_web_email.html',
                context={
                    "username": user.username,
                    "set_password_link": generate_reset_url(user, self.request),
                }
            )
        return Response()
