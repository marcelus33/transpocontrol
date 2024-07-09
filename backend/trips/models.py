from datetime import datetime
from django.db import models
from rest_framework.exceptions import APIException
from djmoney.models.fields import MoneyField
from invoice.models import SupplierInvoice
from base.models import Client, Owner, Driver, Truck, Trailer


class Customs(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    city = models.ForeignKey('cities_light.City', on_delete=models.CASCADE, null=True, blank=True)
    code = models.CharField(max_length=255, null=True, blank=True)


class AutoIndex(models.Model):
    enumeration = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    def get_formatted_code(self):
        """
        Return the next code in the corresponding format.
        """
        raise APIException("get_formatted_code not defined yet")

    def increment_index(self):
        """
        Increment the enumeration to next future index.
        """
        self.enumeration += 1
        self.save()

    @classmethod
    def get_current_index(cls):
        """
        Return the actual instance of the year and code for the future index.
        """
        current_year = datetime.now().year
        this_year_index = cls.objects.filter(year=current_year).first()
        if this_year_index is None:
            this_year_index = cls(enumeration=1, year=current_year)
            this_year_index.save()
        return this_year_index

    class Meta:
        abstract = True


class CRTIndex(AutoIndex):
    def get_formatted_code(self):
        """
        Return the next code in the corresponding format.
        """
        return f'PY{self.year}JPC{str(self.enumeration).zfill(4)}'


class DTAIndex(AutoIndex):
    def get_formatted_code(self):
        """
        Return the next code in the corresponding format.
        """
        pass


class CRT(models.Model):
    sender = models.CharField(max_length=255, null=True, blank=True)  # 1 REMITENTE
    crt_number = models.CharField(max_length=50, unique=True)  # 2 NUMERO CRT
    carrier = models.CharField(max_length=255, null=True, blank=True)  # 3 TRANSPORTADOR
    recipient = models.CharField(max_length=255, null=True, blank=True)  # 4 DESTINATARIO
    place_of_issue = models.CharField(max_length=255, null=True, blank=True)  # 5 LUGAR Y PAIS DE EMISION
    consignee = models.CharField(max_length=255, null=True, blank=True)  # 6 CONSIGNATARIO

    loading_place = models.CharField(max_length=255, null=True, blank=True)  # 7 LUGAR DE CARGA
    loading_date = models.DateField()  # 7 FECHA DE CARGA
    destination_place = models.CharField(max_length=255, null=True, blank=True)  # 8 LUGAR DESTINO

    notify_party = models.CharField(max_length=255, null=True, blank=True)  # 9 NOTIFICAR A

    successive_carriers = models.TextField(blank=True, null=True)  # 10 TRANSPORTADORES SUCESIVOS
    contains = models.TextField()  # 11 DICE CONTENER

    # TODO: create Unit model to relate measurement units
    gross_weight_kg = models.DecimalField(max_digits=10, decimal_places=2)  # 12 PESO BRUTO EN KG
    net_weight_kg = models.DecimalField(max_digits=10, decimal_places=2)  # 12 PESO NETO EN KG
    volume_mcu = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # 13 VOLUMEN EN MCU
    load_value = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0)  # 14 VALOR DE CARGA

    # 15 GASTOS, expenses FK
    class MerchandiseValueType(models.IntegerChoices):
        FOB = 1, 'FOB'
        CIF = 2, 'CIF'

    # 16 TIPO DE DECLARACIÓN DE MERCADERÍA 1
    type_merchandise_1 = models.IntegerField(choices=MerchandiseValueType.choices, null=True)
    # 16 VALOR DE DECLARACIÓN DE MERCADERÍA 1
    merchandise_value_1 = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0)
    # 16 TIPO DE DECLARACIÓN DE MERCADERÍA 2
    type_merchandise_2 = models.IntegerField(choices=MerchandiseValueType.choices, null=True)
    # 16 VALOR DE DECLARACIÓN DE MERCADERÍA 2
    merchandise_value_2 = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0, null=True)

    # fob_name = models.TextField(blank=True, null=True)  # ? VALOR (CIF)
    # fob_value = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', null=True)  # ? VALOR (CIF)
    # cif_name = models.TextField(blank=True, null=True)  # ? VALOR (CIF)
    # cif_value = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', null=True)  # ? VALOR (CIF)

    attached_documents = models.TextField(null=True, blank=True)  # 17 DOCUMENTOS ANEXOS (FACTURA DE EXPORTACION?)
    customs_instructions = models.TextField(blank=True, null=True)  # 18 INSTRUCCIONES SOBRE FORMALIDADES DE ADUANA

    external_freight_amount = MoneyField(max_digits=15, decimal_places=2, default_currency='USD',
                                         default=0)  # 19 MONTO FLETE EXTERNO
    reimbursement_amount = MoneyField(max_digits=15, decimal_places=2, default_currency='USD',
                                      default=0)  # 20 MONTO DE REEMBOLSO

    remarks = models.TextField(blank=True, null=True)  # 22 OBSERVACIONES/DECLARACIONES

    # sender_signature = models.CharField(max_length=255, blank=True,
    #                                     null=True)  # 21 FIRMA REMITENTE, nombre remitente en form?
    carrier_name = models.CharField(max_length=255, blank=True, null=True)  # 23 NOMBRE PORTEADOR, firma renglon 1
    carrier_signature = models.CharField(max_length=255, blank=True, null=True)  # 23 FIRMA PORTEADOR, firma renglon 2
    carrier_signature_date = models.DateField(null=True, blank=True)  # 23 FECHA FIRMA PORTEADOR
    recipient_signature = models.CharField(max_length=255, blank=True,
                                           null=True)  # 24 FIRMA DESTINATARIO, firma renglon 2?

    def save(self, *args, **kwargs):
        """
        Saving CRT with the next CRT code.
        """
        if self._state.adding:
            crt_index = CRTIndex.get_current_index()
            self.crt_number = crt_index.get_formatted_code()
            crt_index.increment_index()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['crt_number']

    def __str__(self):
        return self.crt_number


class CRTExpense(models.Model):
    crt = models.ForeignKey(CRT, on_delete=models.CASCADE, related_name='expenses')
    description = models.CharField(max_length=255)
    sender_amount = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0)
    recipient_amount = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0)

    def __str__(self):
        return f"#{self.crt.crt_number} - {self.description} - {self.sender_amount} - {self.recipient_amount}"


class DTA(models.Model):
    # TODO: find out which fields are required and update model
    carrier = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True,
                                related_name='dta_carrier')  # 1 Nombre y Domicilio del Transportador
    transito_aduanero = models.BooleanField(null=True, blank=True)  # 2 Transito Aduanero
    carrier_rol_del_contribuyente = models.CharField(max_length=255, null=True, blank=True)  # 3 Rol del contribuyente
    MIC_DTA_number = models.CharField(max_length=255, null=True, blank=True)  # 4 Numero
    issue_date = models.DateField(null=True, blank=True)  # 6 Fecha de emision

    # Datos de Aduana del Pais de Partida
    departure_customs = models.ForeignKey('cities_light.City', on_delete=models.CASCADE, null=True, blank=True,
                                          related_name='dta_departure_customs')  # 7

    # Datos del Pais de destino
    destination_city = models.ForeignKey('cities_light.City', on_delete=models.CASCADE, null=True, blank=True,
                                         related_name='dta_destination_city')  # 8.1
    destination_code = models.PositiveIntegerField(null=True, blank=True)  # 8.3

    # Datos del vehiculo 'original' 9, 10, 11, 12, 13, 14
    truck = models.ForeignKey(Truck, on_delete=models.CASCADE, null=True, blank=True, related_name='dta_truck')
    is_semi_trailer = models.BooleanField(null=True, blank=True)  # 15.1 Semiremolque o Remolque
    trailer = models.ForeignKey(Trailer, on_delete=models.CASCADE, null=True, blank=True,
                                related_name='dta_trailer')  # 15.2 Placa

    # Datos del vehiculo 'substituto' 16, 17, 18, 19, 20, 21
    substitute_truck = models.ForeignKey(Truck, on_delete=models.CASCADE, null=True, blank=True,
                                         related_name='dta_substitute_truck')

    substitute_is_semi_trailer = models.BooleanField(null=True, blank=True)  # 22.1 Semiremolque o Remolque
    substitute_trailer = models.ForeignKey(Trailer, on_delete=models.CASCADE, null=True, blank=True,
                                           related_name='dta_substitute_trailer')  # 22.2 Placa

    attached_documents = models.CharField(max_length=255, null=True, blank=True)  # 36 Documentos anexos
    number_of_p = models.PositiveIntegerField(null=True, blank=True)  # 37 Numero de precintos

    # Marcas y numeros de los bultos
    cargo_description = models.CharField(max_length=255, null=True, blank=True)  # 38.1
    cargo_description_code = models.CharField(max_length=10, null=True, blank=True)  # 38.2

    # Firmas
    carrier_signature = models.CharField(max_length=255, blank=True, null=True)  # 39 FIRMA transportador ??
    carrier_signature_date = models.DateField(null=True, blank=True)  # 39.2 fecha
    customs_signature = models.CharField(max_length=255, blank=True, null=True)  # 39 FIRMA aduana de partida ??
    customs_signature_date = models.DateField(null=True, blank=True)  # 41.2 fecha

    # Numero DTA, ruta y plazo de transporte
    DTA_number = models.CharField(max_length=255, null=True, blank=True)  # 40.1
    DTA_ETA = models.CharField(max_length=255, null=True, blank=True)  # 40.3

    # ??
    extra_1 = models.CharField(max_length=255, null=True, blank=True)
    extra_2 = models.CharField(max_length=255, null=True, blank=True)


class DTAShipmentDetail(models.Model):
    dta = models.ForeignKey(DTA, on_delete=models.CASCADE, null=True, blank=True,
                                            related_name='shipment_details')
    page_number = models.PositiveIntegerField(null=True, blank=True)  # 5 Hoja
    bill_of_lading = models.CharField(max_length=255, null=True, blank=True)  # 23 Carta de Porte
    destination_customs = models.ForeignKey('cities_light.City', on_delete=models.CASCADE, null=True, blank=True,
                                            related_name='dta_destination_customs')  # 24 Aduana de Destino
    # Origen de Mercancias
    origin_goods = models.ForeignKey('cities_light.City', on_delete=models.CASCADE, null=True, blank=True,
                                          related_name='dta_origen_mercancias')  # 26.1
    origin_goods_code = models.CharField(max_length=3, null=True, blank=True)  # 26.2
    # Detalles y Precio
    FOT_value_and_currency = MoneyField(max_digits=15, decimal_places=2, default_currency='USD', default=0, null=True,
                                        blank=True)  # 25 currency y 27 FOT Value

    freight_in_usd = models.PositiveIntegerField(null=True, blank=True)  # 28 Flete en USD
    insurance_in_usd = models.PositiveIntegerField(null=True, blank=True)  # 29 Seguro en USDs

    # Cargo type and quantity
    cargo_type = models.CharField(max_length=255, null=True, blank=True)  # 30.1 Tipo de Bultos
    cargo_type_code = models.PositiveIntegerField(null=True, blank=True)  # 30.2 Tipo de Bultos codigo
    cargo_quantity = models.PositiveIntegerField(null=True, blank=True)  # 31 Cantidad de bultos

    # Cargo weight
    gross_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 32.1 Peso Neto
    net_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # 32.2 Peso Bruto

    contains = models.TextField()  # 11 DICE CONTENER

    # Involved parties
    sender = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True,
                               related_name='dta_sender')  # 33 Remitente
    recipient = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name='dta_recipient')  # 34 Destinatario
    consignee = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name='dta_consignee')  # 35 Consignatario

    export_invoice = models.ForeignKey(SupplierInvoice, on_delete=models.PROTECT,
                                       related_name='invoice_dta', null=True)
    # Ruta
    DTA_route = models.CharField(max_length=255, null=True, blank=True)  # 40.2

    driver_1 = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='DTA_primary_driver')
    driver_2 = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='DTA_secondary_driver')

    def save(self, *args, **kwargs):
        """
        Saving DTA with the next DTA code.
        """
        if self._state.adding:
            dta_index = DTAIndex.get_current_index()
            self.MIC_DTA_number = dta_index.get_formatted_code()
            dta_index.increment_index()
        super().save(*args, **kwargs)
