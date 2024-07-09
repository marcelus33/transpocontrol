import React, { useState, useEffect } from 'react'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'

import { Card } from '@mui/material'

import colors from 'assets/theme/base/colors'
import { useConfigurations } from 'hooks/configurations.hook'

import AdminLayout from 'components/Layout/AdminLayout'
import MDBox from 'components/MDUI/MDBox'
import MDButton from 'components/MDUI/MDButton'
import MDTypography from 'components/MDUI/MDTypography'
import FormikInput from 'components/FormInputs/FormikInput'

const configInitialValues = {
  formato_numero_ventas: '#,##',
  imprimir_automaticamente_finalizar_venta: false,
  items_por_factura: 30,
  modificar_precio_item_venta: false,
  modificar_valor_total_venta: false,
  mostrar_costo_grilla_productos: false,
  mostrar_descuento_grilla_ventas: false,
  mostrar_ganancia_grilla_productos: false,
  mostrar_imagen_producto_principal: false,
  mostrar_total_otras_monedas: false,
  no_usar_precios_mayoristas: false,
  numero_factura_1: '0',
  numero_factura_2: '0',
  numero_factura_3: '0',
  permitir_ventas_sin_stock: false,
}

const FormGroupRow = ({ children }) => (
  <MDBox sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    {children}
  </MDBox>
)

const ConfigureUsers = () => {
  const { configurations, configurationsLoading, getConfigurations, saveConfigurations } =
    useConfigurations()
  const [initialValues, setInitialValues] = useState(configInitialValues)

  const submitConfigurations = (values) => {
    const valuesCopy = { ...values }
    const { numero_factura_1, numero_factura_2, numero_factura_3 } = valuesCopy
    valuesCopy['numero_factura'] = `${numero_factura_1}-${numero_factura_2}-${numero_factura_3}`
    saveConfigurations(valuesCopy)
  }

  const validationSchema = Yup.object().shape({
    formato_numero_ventas: Yup.string().required('Este campo es requerido'),
    imprimir_automaticamente_finalizar_venta: Yup.boolean().required('Este campo es requerido'),
    items_por_factura: Yup.number()
      .required('Este campo es requerido')
      .integer('Debe ser un número entero')
      .positive('Debe ser un número positivo'),
    modificar_precio_item_venta: Yup.boolean().required('Este campo es requerido'),
    modificar_valor_total_venta: Yup.boolean().required('Este campo es requerido'),
    mostrar_costo_grilla_productos: Yup.boolean().required('Este campo es requerido'),
    mostrar_descuento_grilla_ventas: Yup.boolean().required('Este campo es requerido'),
    mostrar_ganancia_grilla_productos: Yup.boolean().required('Este campo es requerido'),
    mostrar_imagen_producto_principal: Yup.boolean().required('Este campo es requerido'),
    mostrar_total_otras_monedas: Yup.boolean().required('Este campo es requerido'),
    no_usar_precios_mayoristas: Yup.boolean().required('Este campo es requerido'),
    numero_factura_1: Yup.string().required('Este campo es requerido'),
    numero_factura_2: Yup.string().required('Este campo es requerido'),
    numero_factura_3: Yup.string().required('Este campo es requerido'),
    permitir_ventas_sin_stock: Yup.boolean().required('Este campo es requerido'),
  })

  const formikConfiguration = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => submitConfigurations(values),
  })

  useState(() => {
    getConfigurations()
  }, [])

  useEffect(() => {
    // Reinitialize Formik Form
    if (configurations) {
      let initialFormValues = configurations.reduce((acc, config) => {
        acc[config.key] = config.value
        return acc
      }, {})
      const { numero_factura = '' } = initialFormValues
      //
      if (numero_factura.includes('-')) {
        initialFormValues['numero_factura_1'] = numero_factura.split('-')[0]
        initialFormValues['numero_factura_2'] = numero_factura.split('-')[1]
        initialFormValues['numero_factura_3'] = numero_factura.split('-')[2]
      }
      setInitialValues(initialFormValues)
    }
  }, [configurations])

  return (
    <AdminLayout title={'Configuración'}>
      {!configurationsLoading && (
        <FormikProvider value={formikConfiguration}>
          <Card sx={{ padding: 4, bgcolor: colors.grey[100], flex: 1, display: 'flex', gap: 2 }}>
            {/* ========================== SELECT ========================== */}
            <FormGroupRow>
              <FormikInput
                name="formato_numero_ventas"
                label={'Formato de número en VENTAS'}
                placeholder={''}
                type="autocomplete"
                // TODO: define options....
                options={[{ id: 1, name: '#,##0' }]}
                errors={formikConfiguration.errors}
                sx={{ maxWidth: '520px' }}
              />
              <MDTypography sx={{ fontSize: 12, marginBottom: '12px' }}>Ej 23.000</MDTypography>
            </FormGroupRow>
            {/* ======================= INPUTS GROUP ======================= */}
            <FormGroupRow>
              <MDTypography sx={{ fontSize: 12, marginBottom: '12px' }}>
                Números de Facturas
              </MDTypography>
              <FormikInput
                name={'numero_factura_1'}
                label={''}
                placeholder={''}
                errors={formikConfiguration.errors}
                sx={{ flex: 1 }}
              />
              <MDTypography sx={{ fontSize: 12, marginBottom: '12px' }}>-</MDTypography>
              <FormikInput
                name={'numero_factura_2'}
                label={''}
                placeholder={''}
                errors={formikConfiguration.errors}
                sx={{ flex: 1 }}
              />
              <MDTypography sx={{ fontSize: 12, marginBottom: '12px' }}>-</MDTypography>
              <FormikInput
                name={'numero_factura_3'}
                label={''}
                placeholder={''}
                errors={formikConfiguration.errors}
                sx={{ flex: 1 }}
              />
              <MDTypography sx={{ fontSize: 12, marginBottom: '12px' }}>
                Items por Facturas
              </MDTypography>
              <FormikInput
                name={'items_por_factura'}
                label={''}
                placeholder={''}
                errors={formikConfiguration.errors}
                sx={{ flex: 1 }}
              />
            </FormGroupRow>
            {/* ======================= SWITCHS GROUP ======================= */}
            <FormGroupRow>
              <MDBox
                sx={{
                  paddingRight: 4,
                  borderRight: '2px',
                  borderRightColor: '#cccccc',
                  borderRightStyle: 'solid',
                }}
              >
                {/* ======== BOOLEAN VALUES FOR SWITCHS 1 TO 5 ======== */}
                {configurations
                  .filter((config) => typeof config.value === 'boolean')
                  .slice(0, 5)
                  .map((config, cidx) => (
                    <FormikInput
                      name={config.key}
                      checked={formikConfiguration.values[config.key]}
                      // checked={config.value}
                      label={config.description}
                      type="switch"
                      placeholder={''}
                      errors={formikConfiguration.errors}
                      sx={{ flex: 1, justifyContent: 'space-between' }}
                    />
                  ))}
              </MDBox>
              <MDBox sx={{ flex: 1, marginLeft: 4 }}>
                {/* ======== BOOLEAN VALUES FOR SWITCHS 5 TO 10 ======== */}
                {configurations
                  .filter((config) => typeof config.value === 'boolean')
                  .slice(5)
                  .map((config, cidx) => (
                    <FormikInput
                      name={config.key}
                      checked={formikConfiguration.values[config.key]}
                      label={config.description}
                      type="switch"
                      placeholder={''}
                      errors={formikConfiguration.errors}
                      sx={{ flex: 1, justifyContent: 'space-between' }}
                    />
                  ))}
              </MDBox>
            </FormGroupRow>
          </Card>
          {/* ======================= SUBMIT FOOTER ======================= */}
          <MDBox sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <MDButton
              color="primary"
              variant="contained"
              onClick={() => {
                formikConfiguration.handleSubmit()
              }}
            >
              Guardar
            </MDButton>
          </MDBox>
        </FormikProvider>
      )}
    </AdminLayout>
  )
}

export default ConfigureUsers
