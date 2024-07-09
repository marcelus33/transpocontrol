# Generated by Django 5.0.4 on 2024-05-20 19:28

from django.db import migrations


def populate_configurations(apps, schema_editor):
    Configuration = apps.get_model('configuration', 'Configuration')

    configurations = [
        {'key': 'permitir_ventas_sin_stock', 'value': False, 'description': 'Permitir Ventas Sin Stock'},
        {'key': 'no_usar_precios_mayoristas', 'value': False, 'description': 'No Usar Precios Mayoristas'},
        {'key': 'mostrar_descuento_grilla_ventas', 'value': False,
         'description': 'Mostrar el Descuento en la Grilla de Ventas'},
        {'key': 'modificar_valor_total_venta', 'value': False, 'description': 'Modificar el Valor Total de la Venta'},
        {'key': 'modificar_precio_item_venta', 'value': False, 'description': 'Modificar el Precio en Item de Venta'},
        {'key': 'imprimir_automaticamente_finalizar_venta', 'value': False,
         'description': 'Imprimir automáticamente al Finalizar una Venta'},
        {'key': 'mostrar_imagen_producto_principal', 'value': False,
         'description': 'Mostrar Imagen del Producto en la ventana principal'},
        {'key': 'mostrar_costo_grilla_productos', 'value': False,
         'description': 'Mostrar COSTO en la grilla de Productos'},
        {'key': 'mostrar_ganancia_grilla_productos', 'value': False,
         'description': 'Mostrar GANANCIA en la grilla de Productos'},
        {'key': 'mostrar_total_otras_monedas', 'value': False, 'description': 'Mostrar TOTAL en otras monedas'},
        {'key': 'formato_numero_ventas', 'value': '#,##', 'description': 'Formato de Número en VENTAS'},
        {'key': 'numero_factura', 'value': '0-0-0', 'description': 'Número de Factura'},
        {'key': 'items_por_factura', 'value': 30, 'description': 'Items Por Factura'},
    ]

    for config in configurations:
        Configuration.objects.update_or_create(
            key=config['key'],
            defaults={'value': config['value'], 'description': config['description']}
        )


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_configurations),
    ]