from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import get_default_password_validators
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import INTERNAL_RESET_SESSION_TOKEN
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from utils.utils import get_user_by_uidb64

User = get_user_model()


class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']


class GroupSerializer(ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']


class GroupCreateSerializer(ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(many=True, queryset=Permission.objects.all())

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']


class UserListSerializer(ModelSerializer):
    groups = GroupSerializer(many=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_active', 'last_login', 'last_activity', 'date_joined',
                  'groups', 'description', 'status_changed_at']


class UserManagementSerializer(ModelSerializer):
    """
    Serializer for creating a new user.
    """

    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'description',
                  'password_never_expires', 'password_expiry_days', 'change_password_next_login',
                  'groups', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def __init__(self, *args, **kwargs):
        super(UserManagementSerializer, self).__init__(*args, **kwargs)
        if self.instance is not None:
            self.fields['password'].required = False

    def validate_email(self, email):
        """
        Validate if email is already in use or not
        """
        existing_user = User.objects.filter(email=email).first()
        if existing_user and not existing_user == self.instance:
            raise ValidationError(
                _("A user is already registered with this e-mail address."))
        return email

    def validate_username(self, username):
        """
        Validate if username is already in use or not
        """
        existing_user = User.objects.filter(username=username).first()
        if existing_user and not existing_user == self.instance:
            raise ValidationError(
                _("A user is already registered with this username."))
        return username

    def create(self, validated_data):
        """
        Create user
        """
        email = validated_data['email']
        username = validated_data.get('username', email)
        name = validated_data['name']
        user = User(email=email, username=username, is_active=True, name=name)
        user.set_password(validated_data['password'])
        description = validated_data.get('description', '')
        if description:
            user.description = description
        user.save()
        groups = validated_data.pop('groups')
        user.groups.add(groups[0])
        return user

    def update(self, instance, validated_data):
        """
        Update user
        """
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.description = validated_data.get('description', instance.description)
        if validated_data.get('password', None):
            instance.set_password(validated_data.get('password'))
        instance.save()
        return instance


class UserDetailSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_active']


class UserLoginResponseSerializer(Serializer):
    class Meta:
        model = User

    def to_representation(self, instance):
        """
        Override the default to_representation method to format the data as needed
        """
        token = TokenObtainPairSerializer.get_token(instance)
        ret = {
            'access': str(token.access_token),
            'refresh': str(token),
            'user': UserDetailSerializer(instance).data,
        }
        return ret


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    token_generator = default_token_generator

    def validate_token(self, token):
        INTERNAL_RESET_URL_TOKEN = 'set-password'
        request = self.context.get('request')
        user = get_user_by_uidb64(self.initial_data['uidb64'])
        if user is not None:
            if token == INTERNAL_RESET_URL_TOKEN:
                session_token = request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(user, session_token):
                    return
            else:
                if self.token_generator.check_token(user, token):
                    request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                    return
        raise serializers.ValidationError("Invalid token")

    def validate_password(self, data):
        password_validators = get_default_password_validators()
        errors = []
        for validator in password_validators:
            try:
                validator.validate(data.get('new_password'), get_user_by_uidb64(self.initial_data['uidb64']))
            except (ValidationError, DjangoValidationError) as error:
                errors.append(" ".join(error.messages))
        if errors:
            raise serializers.ValidationError(detail={'errors': errors})

    def validate(self, data):
        self.validate_password(data)
        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, current_password):
        request = self.context.get('request')
        if not request.user.check_password(current_password):
            raise serializers.ValidationError("The current password is not valid.")
        return current_password

    def validate_new_password(self, new_password):
        request = self.context.get('request')
        password_validators = get_default_password_validators()
        errors = []
        for validator in password_validators:
            try:
                validator.validate(new_password, request.user)
            except (ValidationError, DjangoValidationError) as error:
                errors.append(" ".join(error.messages))
        if errors:
            raise serializers.ValidationError(detail={'errors': errors})
        return new_password


class SendResetLinkSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        fields = ['email']

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email does not exist.")
        return email
