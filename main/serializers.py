from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PollutionType, PollutionImage, Pollutions

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'telegram_id']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'telegram_id']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PollutionSerializer(serializers.ModelSerializer):
    pollution_type = serializers.SlugRelatedField(slug_field='name', queryset=PollutionType.objects.all())
    image = serializers.ImageField(write_only=True, required=False)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Pollutions
        fields = ['id', 'latitude', 'longitude', 'description', 'pollution_type', 'created_at', 'reported_by', 'is_approved', 'image', 'image_url', 'phone_number']
        read_only_fields = ['id', 'created_at', 'reported_by', 'is_approved', 'image_url']

    def get_image_url(self, obj):
        if obj.images and obj.images.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.images.image.url)
            return obj.images.image.url
        return None

    def create(self, validated_data):
        image_data = validated_data.pop('image')
        user = self.context['request'].user
        validated_data['reported_by'] = user
        
        pollution_image = PollutionImage.objects.create(image=image_data)
        validated_data['images'] = pollution_image
        
        pollution = Pollutions.objects.create(**validated_data)
        return pollution