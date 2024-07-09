from djmoney.money import Money
from reportlab.lib.pagesizes import LEGAL
from reportlab.pdfgen import canvas

points_constant_cm = 28.35  # 28.35 points per centimeter

top_margin = points_constant_cm * 1.25  # includes header
left_margin = points_constant_cm * 1.25
header = points_constant_cm * 1.9

width, height = LEGAL


def cm_to_height(cm):
    return height - top_margin - header - (points_constant_cm * cm)


def cm_to_width(cm):
    return left_margin + (points_constant_cm * cm)


def create_dta_pdf(dta, buffer):
    c = canvas.Canvas(buffer, pagesize=LEGAL)
    c.setFont("Helvetica", 10)

    # Field 1: Carrier Name and Address
    c.drawString(cm_to_width(0.5), cm_to_height(0.2), get_value(dta, 'carrier'))

    # Field 2: Tránsito Aduanero (Checkbox Yes/No)
    if dta.transito_aduanero:
        c.drawString(cm_to_width(10.1), cm_to_height(0.4), 'X')
    else:
        c.drawString(cm_to_width(11.5), cm_to_height(0.4), 'X')

    # Field 3: Rol del contribuyente
    c.drawString(cm_to_width(0.5), cm_to_height(3.6), get_value(dta, 'carrier_rol_del_contribuyente'))

    # Field 4: MIC/DTA Number
    c.drawString(cm_to_width(13), cm_to_height(0.3), get_value(dta, 'MIC_DTA_number'))

    # Field 5: Page Number
    if dta.page_number is not None:
        c.drawString(cm_to_width(11), cm_to_height(1.4), str(dta.page_number))

    # Field 6: Issue Date
    issue_date = dta.issue_date
    if issue_date:
        issue_date_str = issue_date.strftime('%d/%m/%Y')
        c.drawString(cm_to_width(13), cm_to_height(1.3), issue_date_str)

    # Field 7: Departure Customs
    c.drawString(cm_to_width(10), cm_to_height(2.4), get_value(dta, 'departure_customs'))

    # Field 7.1: Departure Customs
    c.drawString(cm_to_width(16.2), cm_to_height(2.7), get_value(dta, 'departure_customs_code'), charSpace=8)

    # Field 8: Destination City
    c.drawString(cm_to_width(10), cm_to_height(3.7), get_value(dta, 'destination_city'))

    # Field 8.1: Destination Code
    if dta.destination_code is not None:
        c.drawString(cm_to_width(18), cm_to_height(4.1), str(dta.destination_code), charSpace=8)

        # Field 9: Truck Owner
        c.drawString(cm_to_width(0.5), cm_to_height(5.3), get_value(dta.truck, 'owner.name'))

        # Field 10: Truck Owner Rol del Contribuyente (Owner's RUC)
        c.drawString(cm_to_width(0.5), cm_to_height(7.8), get_value(dta.truck, 'owner.ruc'))

        # Field 11: Truck License Plate
        c.drawString(cm_to_width(5.2), cm_to_height(7.8), get_value(dta.truck, 'plate'))

        # Field 12: Brand Model
        c.drawString(cm_to_width(0.5), cm_to_height(9), get_value(dta.truck, 'brand'))

        # Field 13: Towing Capacity
        c.drawString(cm_to_width(5.2), cm_to_height(9), get_value(dta.truck, 'load_capacity'))

        # Field 14: Truck Year
        if dta.truck:
            truck_year = dta.truck.year
            if truck_year:
                truck_year_str = str(truck_year)
                c.drawString(cm_to_width(0.5), cm_to_height(10.2), truck_year_str)

    # Field 15: Is Semi-Trailer
    if dta.is_semi_trailer:
        c.drawString(cm_to_width(5.3), cm_to_height(9.9), 'X')
    else:
        c.drawString(cm_to_width(7.8), cm_to_height(9.9), 'X')

    # Field 15.2: Trailer License Plate
    c.drawString(cm_to_width(5.7), cm_to_height(10.6), get_value(dta.trailer, 'plate'))

    # Substitute Vehicle Fields (Fields 16 to 21)
    c.drawString(cm_to_width(10), cm_to_height(5.4), get_value(dta.substitute_truck, 'owner.name'))

    # Field 17: Substitute Truck Owner Rol del Contribuyente (Owner's RUC)
    c.drawString(cm_to_width(10), cm_to_height(7.8), get_value(dta.substitute_truck, 'owner.ruc'))

    # Field 18: Substitute Truck License Plate
    c.drawString(cm_to_width(14.9), cm_to_height(7.8), get_value(dta.substitute_truck, 'plate'))

    # Field 19: Substitute Brand Model
    c.drawString(cm_to_width(10), cm_to_height(9), get_value(dta.substitute_truck, 'brand'))

    # Field 20: Substitute Towing Capacity
    c.drawString(cm_to_width(14.9), cm_to_height(9), get_value(dta.substitute_truck, 'load_capacity'))

    # Field 21: Substitute Truck Year
    if dta.substitute_truck:
        substitute_truck_year = dta.substitute_truck.year
        if substitute_truck_year:
            substitute_truck_year_str = str(substitute_truck_year)
            c.drawString(cm_to_width(10), cm_to_height(10.2), substitute_truck_year_str)

    if dta.substitute_is_semi_trailer:
        c.drawString(cm_to_width(15), cm_to_height(9.9), 'X')
    else:
        c.drawString(cm_to_width(17.6), cm_to_height(9.9), 'X')

    c.drawString(cm_to_width(16), cm_to_height(10.6), get_value(dta.substitute_trailer, 'plate'))

    # Field 23: Carta de Porte Number
    c.drawString(cm_to_width(0.5), cm_to_height(11.8), get_value(dta, 'carta_de_porte_number'))

    # Field 24: Destination Customs
    c.drawString(cm_to_width(3.5), cm_to_height(11.5), get_value(dta, 'destination_customs'))

    # Field 24.1: Destination Customs Code
    c.drawString(cm_to_width(6.4), cm_to_height(12), get_value(dta, 'destination_customs_code'), charSpace=8)

    # Field 25 and 27: Currency and Value
    FOT_value_and_currency = dta.FOT_value_and_currency
    if FOT_value_and_currency:
        if isinstance(FOT_value_and_currency, dict):
            currency = FOT_value_and_currency.get('currency', '')
            value = FOT_value_and_currency.get('amount', 0)
        elif isinstance(FOT_value_and_currency, Money):
            currency = FOT_value_and_currency.currency
            value = FOT_value_and_currency.amount
        else:
            raise ValueError("FOT_value_and_currency must be a dictionary or a Money instance")

        c.drawString(cm_to_width(0.5), cm_to_height(13), str(currency))
        c.drawString(cm_to_width(0.5), cm_to_height(14.3), str(value))

    # Field 26: Origen Mercancias
    c.drawString(cm_to_width(3.45), cm_to_height(12.8), get_value(dta, 'origen_mercancias'))
    c.drawString(cm_to_width(8.2), cm_to_height(13.3), get_value(dta, 'origen_mercancias_code'), charSpace=8)

    # Field 28: Freight in USD
    c.drawString(cm_to_width(3.5), cm_to_height(14.5), str(dta.freight_in_usd))

    # Field 29: Insurance in USD
    c.drawString(cm_to_width(6.7), cm_to_height(14.5), str(dta.insurance_in_usd))

    # Field 30: Cargo Type
    c.drawString(cm_to_width(0.3), cm_to_height(15.8), get_value(dta, 'cargo_type'))
    # Field 30.1: Cargo Type Code
    c.drawString(cm_to_width(2), cm_to_height(16.15), str(dta.cargo_type_code), charSpace=8)

    # Field 31: Cargo Quantity
    c.drawString(cm_to_width(3.5), cm_to_height(15.8), str(dta.cargo_quantity))

    # Field 32.1: Gross Weight
    c.drawString(cm_to_width(6.7), cm_to_height(15.8), str(dta.gross_weight))

    # # Field 32.2: Net Weight
    c.drawString(cm_to_width(6.7), cm_to_height(16.2), str(dta.net_weight))

    # Field 33: Sender
    c.drawString(cm_to_width(10), cm_to_height(11.5), get_value(dta, 'sender'))

    # Field 34: Recipient
    c.drawString(cm_to_width(10), cm_to_height(12.8), get_value(dta, 'recipient'))

    # Field 35: Consignee
    c.drawString(cm_to_width(10), cm_to_height(14.2), get_value(dta, 'consignee'))

    # Field 36: Attached Documents
    c.drawString(cm_to_width(10), cm_to_height(15.6), get_value(dta, 'attached_documents'))

    # Field 37: Number of Precincts
    c.drawString(cm_to_width(0.5), cm_to_height(17.2), str(dta.number_of_p))

    # Field 38.1: Cargo Description
    c.drawString(cm_to_width(0.3), cm_to_height(18.3), get_value(dta, 'cargo_description'))

    # Field 38.2: Cargo Description Code
    c.drawString(cm_to_width(14.7), cm_to_height(20.4), get_value(dta, 'cargo_description_code'), charSpace=8)

    # Field 39: Carrier Signature and Date
    carrier_signature_date = dta.carrier_signature_date
    if carrier_signature_date:
        carrier_signature_date_str = carrier_signature_date.strftime('%d/%m/%Y')
        c.drawString(cm_to_width(1.8), cm_to_height(26.2), carrier_signature_date_str)

    # Field 40: DTA Number, Route, and ETA
    c.drawString(cm_to_width(10), cm_to_height(21.6), get_value(dta, 'DTA_number'))
    c.drawString(cm_to_width(10), cm_to_height(22), get_value(dta, 'DTA_route'))
    c.drawString(cm_to_width(10), cm_to_height(22.4), get_value(dta, 'DTA_ETA'))
    c.drawString(cm_to_width(10), cm_to_height(22.8), get_value(dta, 'extra_1'))
    c.drawString(cm_to_width(10), cm_to_height(23.2), get_value(dta, 'extra_2'))
    c.drawString(cm_to_width(10), cm_to_height(23.6), get_value(dta, 'driver_1'))
    c.drawString(cm_to_width(10), cm_to_height(24), get_value(dta, 'driver_2'))

    # Field 41: Customs Signature and Date
    customs_signature_date = dta.customs_signature_date
    if customs_signature_date:
        customs_signature_date_str = customs_signature_date.strftime('%d/%m/%Y')
        c.drawString(cm_to_width(11.5), cm_to_height(26.2), customs_signature_date_str)

    c.showPage()
    c.save()


def get_value(obj, attr, default=''):
    """
    Helper function to get a value from an object instance, supporting nested attributes.
    If the value is None, returns the default value.
    """
    try:
        # Support nested attributes
        for part in attr.split('.'):
            obj = getattr(obj, part, default)
            if obj is default:
                return default
        # If the final attribute has a 'name', return it; otherwise, return the attribute itself
        return obj.name if hasattr(obj, 'name') else obj
    except AttributeError:
        return default
