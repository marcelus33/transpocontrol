from decimal import Decimal

from django.db import transaction
from djmoney.contrib.django_rest_framework import MoneyField
from djmoney.money import Money
from rest_framework import serializers

from base.models import Supplier
from .models import SupplierInvoice, SupplierInvoiceItem


class CustomMoneyFieldSerializer(MoneyField):
    def to_representation(self, obj):
        if obj is None:
            return None
        return {
            'amount': float(obj.amount),
            'currency': obj.currency.code
        }

    def to_internal_value(self, data):
        if data is None:
            return None
        # if a dictionary is received instead of a numeric value
        if isinstance(data.amount, dict):
            data = data.amount
            amount = data.get('amount', None)
            currency = data.get('currency', None)
        else:
            amount = data.amount
            currency = data.currency
        if amount is None or currency is None:
            raise serializers.ValidationError("Both 'amount' and 'currency' must be provided.")
        #
        try:
            amount = float(amount)
        except ValueError:
            raise serializers.ValidationError("Invalid amount. Must be a valid number.")
        #
        return Money(amount, currency)


class SupplierDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name']
        read_only_fields = fields


class SupplierInvoiceItemDetailSerializer(serializers.ModelSerializer):
    unit_price = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    tax_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    item_total = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = SupplierInvoiceItem
        fields = ['id', 'quantity', 'description', 'unit_price', 'tax_type', 'tax_amount', 'item_total']
        read_only_fields = fields


class SupplierInvoiceListSerializer(serializers.ModelSerializer):
    supplier = SupplierDetailSerializer(read_only=True)
    outstanding_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    paid_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    total_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = SupplierInvoice
        fields = ['id', 'supplier', 'number', 'date', 'due_date', 'payment_term', 'is_annulled',
                  'total_tax_amount', 'outstanding_amount', 'paid_amount', 'total_amount', ]
        read_only_fields = fields


class SupplierInvoiceDetailSerializer(serializers.ModelSerializer):
    supplier = SupplierDetailSerializer(read_only=True)
    outstanding_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    paid_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    total_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    items = SupplierInvoiceItemDetailSerializer(many=True, read_only=True)

    class Meta:
        model = SupplierInvoice
        fields = ['id', 'supplier', 'number', 'date', 'due_date', 'payment_term', 'is_annulled',
                  'total_tax_amount', 'outstanding_amount', 'paid_amount', 'total_amount', 'observation', 'items']
        read_only_fields = fields


class SupplierInvoiceItemSerializer(serializers.ModelSerializer):
    unit_price = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    tax_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    item_total = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = SupplierInvoiceItem
        fields = ['id', 'quantity', 'description', 'unit_price', 'tax_type', 'tax_amount', 'item_total']

    def validate(self, data):
        quantity = data.get('quantity')
        unit_price = data.get('unit_price')
        tax_type = data.get('tax_type')
        item_total = data.get('item_total')
        tax_amount = data.get('tax_amount')
        description = data.get('description')

        # Convert tax_type to Decimal
        tax_type_decimal = Decimal(str(tax_type))

        # Validate quantity * unit_price == item_total
        calculated_item_total = quantity * unit_price.amount
        if item_total.amount != calculated_item_total:
            raise serializers.ValidationError(f"The calculated item total for item '{description}' "
                                              f"does not match the provided item total.")

        # Validate tax_amount == calculated_item_total * (tax_type / 100)
        calculated_tax_amount = calculated_item_total * (tax_type_decimal / Decimal('100'))
        if tax_amount.amount != calculated_tax_amount:
            raise serializers.ValidationError(f"The calculated tax amount for item '{description}' "
                                              f"does not match the provided tax amount.")

        return data


class SupplierInvoiceSerializer(serializers.ModelSerializer):
    outstanding_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    paid_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    total_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    items = SupplierInvoiceItemSerializer(many=True)

    class Meta:
        model = SupplierInvoice
        fields = ['id', 'supplier', 'number', 'date', 'due_date', 'payment_term', 'is_annulled',
                  'outstanding_amount', 'paid_amount', 'total_amount', 'items', 'observation', ]

    def validate(self, attrs):
        total_amount = attrs.get('total_amount')
        items = attrs.get('items', [])
        items_total = sum(item.get('item_total', {}).amount for item in items)
        #
        if items_total != total_amount.amount:
            raise serializers.ValidationError("Sum of item amounts does not match total amount of invoice.")
        #
        total_tax_amount = sum(item.get('tax_amount', {}).amount for item in items)
        attrs['total_tax_amount'] = total_tax_amount
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        try:
            items_data = validated_data.pop('items', [])
            invoice = SupplierInvoice.objects.create(**validated_data)
            #
            for item_data in items_data:
                SupplierInvoiceItem.objects.create(invoice=invoice, **item_data)
            #
            return invoice
        except Exception as e:
            raise e

    # TODO update method
