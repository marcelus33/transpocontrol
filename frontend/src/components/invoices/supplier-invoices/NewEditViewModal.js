import React, { useCallback, useEffect, useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"
import { useApi } from "utils/helpers"
import Grid from "@mui/material/Grid"
import { CURRENCIES, PAYMENT_TERM_OPTIONS, TAX_TYPES } from "../../../utils/constants"
import MDTypography from "../../MDUI/MDTypography"
import InvoiceItemsTable from "./InvoiceItemsTable"

const NewEditViewModal = ({ open, onDismiss, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [loadingSuppliers, setLoadingSuppliers] = useState(false)
  const [suppliersOptions, setSuppliersOptions] = useState([])
  const [initialValues, setInitialValues] = useState()

  const isEditing = !!selectedItem
  const isViewing = !!selectedItem?.isViewOnly

  const api = useApi()

  const validationSchema = Yup.object().shape({
    supplier: Yup.object().shape({
      id: Yup.number().required("Proveedor es requerido"),
    }).required("Proveedor es requerido"),
    number: Yup.string().required("Número es requerido"),
    date: Yup.date().required("Fecha es requerida"), // payment_term: Yup.number().required("Término de pago es requerido"),
    payment_term: Yup.object().shape({
      id: Yup.number().required("Id es requerido"),
    }).required("Forma de pago es requerido"),
    due_date: Yup.date().nullable(),
    total_tax_amount: Yup.number().required("Monto total de impuesto es requerido"),
    outstanding_amount: Yup.number().required("Monto pendiente es requerido"),
    paid_amount: Yup.number().required("Monto pagado es requerido"),
    total_amount: Yup.number().required("Monto total es requerido"),
    is_annulled: Yup.boolean(),
    items: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        quantity: Yup.number().required("Cantidad es requerida"),
        description: Yup.string().required("Descripción es requerida"),
        unit_price: Yup.object().shape({
          amount: Yup.number().required("Precio unitario es requerido"),
          currency: Yup.string().required("Moneda es requerida"),
        }),
        tax_type: Yup.number().required("Tipo de impuesto es requerido"),
        tax_amount: Yup.object().shape({
          amount: Yup.number().required("Monto de impuesto es requerido"),
          currency: Yup.string().required("Moneda es requerida"),
        }),
        item_total: Yup.object().shape({
          amount: Yup.number().required("Total del ítem es requerido"),
          currency: Yup.string().required("Moneda es requerida"),
        }),
      }),
    ),
  })

  const formikInitialValues = {
    supplier: initialValues?.supplier ? initialValues.supplier : null,
    number: initialValues?.number || "",
    date: initialValues?.date || "",
    payment_term: initialValues?.number ? PAYMENT_TERM_OPTIONS.find((opt, idx) => opt.id === initialValues.payment_term) : PAYMENT_TERM_OPTIONS[1],
    due_date: initialValues?.due_date || "",
    total_tax_amount: initialValues?.total_tax_amount || 0,
    outstanding_amount: initialValues?.outstanding_amount || 0,
    paid_amount: initialValues?.paid_amount || 0,
    total_amount: initialValues?.total_amount || 0,
    is_annulled: initialValues?.is_annulled || false, // helpers values
    currency: CURRENCIES[1],
    iva5: 0,
    iva10: 0,
    items: initialValues?.items || [],
  }

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => handleFormSubmit(values),
    enableReinitialize: true,
  })

  const handleDismiss = () => {
    if (loading) return

    formik.resetForm()
    setSuppliersOptions([])
    setInitialValues(null)
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getSupplierInvoice(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        setInitialValues(results)

        setTimeout(() => formik.setFieldValue("supplier", results.supplier), 500)
      }, errorMessage: "Ocurrió un problema al obtener los datos de la factura", onFinally: () => setLoading(false),
    })
  }

  const getSuppliersList = useCallback((searchTerm) => {
    if (!searchTerm) setLoadingSuppliers(true)
    const params = {
      page: 1, search: searchTerm || undefined,
    }
    //
    api.getSuppliers(params).handle({
      onSuccess: (response) => {
        const results = response?.data?.results
        let supplierOptions = results.map((item) => ({
          id: item.id, name: item.name,
        }))
        setSuppliersOptions(supplierOptions)
      },
      errorMessage: "Ocurrió un problema al obtener la lista de proveedores",
      onFinally: () => !searchTerm && setLoadingSuppliers(false),
    })
  }, [])

  const handleFormSubmit = (data) => {
    setLoading(true)

    const itemData = {
      ...data,
      supplier: data.supplier?.id,
      payment_term: data.payment_term?.id,
    }

    if (isEditing) {
      const itemId = initialValues?.id
      api.updateSupplierInvoice(itemId, itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Factura guardada con éxito",
        errorMessage: "Ocurrió un error al guardar esta factura",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      api.createSupplierInvoice(itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Factura guardada con éxito",
        errorMessage: "Ocurrió un error al guardar esta factura",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    }
  }

  useEffect(() => {
    if (open) {
      getSuppliersList()
    }
  }, [open])

  useEffect(() => {
    if (open && selectedItem) {
      const itemId = selectedItem?.id
      getItem(itemId)
    }

    return () => {
      setInitialValues(null)
    }
  }, [open, selectedItem])

  useEffect(() => {
    const invoiceItems = formik.values.items
    const invoiceItems5 = invoiceItems.filter((item, idx) => item.tax_type === TAX_TYPES[0].id)
    const invoiceItems10 = invoiceItems.filter((item, idx) => item.tax_type === TAX_TYPES[1].id)
    //
    const invoiceItemsIVA5Sum = invoiceItems5.reduce(
      (accumulator, currentItem) => accumulator + currentItem.tax_amount.amount,
      0,
    )
    const invoiceItemsIVA10Sum = invoiceItems10.reduce(
      (accumulator, currentItem) => accumulator + currentItem.tax_amount.amount,
      0,
    )
    const invoiceItemsTotalSum = invoiceItems.reduce(
      (accumulator, currentItem) => accumulator + currentItem.item_total.amount,
      0,
    )
    // CALCULATE AND SET TOTALS WHEN ITEMS CHANGE
    formik.setFieldValue("iva5", invoiceItemsIVA5Sum)
    formik.setFieldValue("iva10", invoiceItemsIVA10Sum)
    formik.setFieldValue("total_tax_amount", invoiceItemsIVA5Sum + invoiceItemsIVA10Sum)
    formik.setFieldValue("total_amount", invoiceItemsTotalSum)
    formik.setFieldValue("outstanding_amount", invoiceItemsTotalSum)
  }, [formik.values.items])

  useEffect(() => {
    // UPDATE DUE DATE EVERYTIME INVOICE DATA CHANGES
    const date = new Date(formik.values.date)
    if (!isNaN(date)) {
      const dueDate = new Date(date.setDate(date.getDate() + 31)).toISOString().split('T')[0]
      formik.setFieldValue("due_date", dueDate)
    }
  }, [formik.values.date])

  let modalTitle = "Nueva factura"
  if (isEditing) modalTitle = "Editar factura"
  if (isViewing) modalTitle = "Ver factura"

  return (
    <Modal title={modalTitle} open={open} handleClose={onDismiss} maxWidth="xl">
      {/*<MDBox sx={{ overflowY: "auto", height: "100%" }}>*/}
      <FormikProvider value={formik}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            {/* ==== NUMERO ==== */}
            <FormikInput
              sx={{ marginTop: 1 }}
              name="number"
              label="Número"
              placeholder=""
              errors={formik.errors}
              disabled={isViewing}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {/* ==== FECHA ==== */}
            <FormikInput
              name="date"
              label="Fecha"
              placeholder=""
              type="date"
              errors={formik.errors}
              disabled={isViewing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* ==== FORMA ==== */}
            <FormikInput
              name={"payment_term"}
              label={"Forma de pago"}
              placeholder={""}
              errors={formik.errors}
              type="autocomplete"
              sx={{ flex: 1, mb: 1 }}
              options={PAYMENT_TERM_OPTIONS}
              disabled={loading || isViewing}
              filterOptions={(x) => x}
            />
          </Grid>
        </Grid>
        {/* */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* ==== PROVEEDOR ==== */}
            {!isViewing && <FormikInput
              name={"supplier"}
              label={"Proveedor"}
              placeholder={""}
              errors={formik.errors}
              type="autocomplete"
              sx={{ flex: 1, mb: 1 }}
              options={suppliersOptions}
              disabled={loadingSuppliers || loading || isViewing}
              filterOptions={(x) => x}
              onInputChange={(value) => {
                getSuppliersList(value)
              }}
            />}
            {isViewing && <FormikInput
              name={"supplier"}
              label={"Proveedor"}
              placeholder={""}
              errors={formik.errors}
              type="autocomplete"
              sx={{ flex: 1, mb: 1 }}
              options={[formik.values.supplier]}
              disabled={loadingSuppliers || loading || isViewing}
              filterOptions={(x) => x}
              onInputChange={(value) => {
                getSuppliersList(value)
              }}
            />}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} marginBottom={3}>
            <MDTypography fontWeight={"bold"} fontSize={"small"} width={"100%"} textAlign={"center"}>
              Detalles de facturación
            </MDTypography>
            <InvoiceItemsTable formik={formik} />
          </Grid>
          {/* ======================== DETALLES FOOTER ======================== */}
          <Grid item container xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Grid item xs={6} md={3}>
              <FormikInput
                name={"currency"}
                label={"Moneda"}
                placeholder={""}
                errors={formik.errors}
                type="autocomplete"
                sx={{ flex: 1, mb: 1 }}
                options={CURRENCIES}
                disabled={loading || isViewing}
                filterOptions={(x) => x}
              />
            </Grid>
            <Grid item xs={12} md={6} display={"flex"} gap={1}>
              <FormikInput
                name="iva5"
                label="IVA 5%"
                placeholder=""
                type="number"
                errors={formik.errors}
                disabled={true}
              />
              <FormikInput
                name="iva10"
                label="IVA 10%"
                placeholder=""
                type="number"
                errors={formik.errors}
                disabled={true}
              />
              <FormikInput
                name="total_amount"
                label="Monto total"
                placeholder=""
                type="number"
                errors={formik.errors}
                disabled={true}
              />
            </Grid>
          </Grid>
        </Grid>
        {/**/}
        <MDBox marginTop={2} marginBottom={2}>
          <hr />
        </MDBox>
        {/**/}

        <Grid container spacing={2}>
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"} gap={2}>
            <FormikInput
              name="paid_amount"
              label="Monto pagado"
              placeholder=""
              type="number"
              errors={formik.errors}
              disabled={isViewing}
              marginTop={1}
            />
            <MDBox display={"flex"} gap={1}>
              <FormikInput
                name="outstanding_amount"
                label="Monto pendiente"
                placeholder=""
                type="number"
                errors={formik.errors}
                disabled={isViewing}
                marginTop={1}
              />
              <FormikInput
                name="due_date"
                label="Fecha de vencimiento"
                placeholder=""
                type="date"
                errors={formik.errors}
                disabled={isViewing}
              />
            </MDBox>
          </Grid>
          {/*  */}
          <Grid item xs={12}>
            <FormikInput
              name={"observation"}
              label={"Observación"}
              placeholder={""}
              type="textarea"
              errors={formik.errors}
              rows={2}
              sx={{ flex: 1, height: "100%" }}
            />
          </Grid>
        </Grid>

        {/*<MDBox sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}>*/}
        {/*  <FormikInput*/}
        {/*    name="total_tax_amount"*/}
        {/*    label="Monto total de impuesto"*/}
        {/*    placeholder=""*/}
        {/*    type="number"*/}
        {/*    errors={formik.errors}*/}
        {/*    disabled={isViewing}*/}
        {/*  />*/}
        {/*  <FormikInput*/}
        {/*    name="is_annulled"*/}
        {/*    label="Anulado"*/}
        {/*    type="checkbox"*/}
        {/*    errors={formik.errors}*/}
        {/*    disabled={isViewing}*/}
        {/*  />*/}
        {/*</MDBox>*/}


        {!isViewing && (<MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={2} pt={2}>
          <MDButton
            variant="contained"
            color="primary"
            loading={loading}
            disabled={loadingSuppliers || loading}
            onClick={() => formik.handleSubmit()}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Guardar
          </MDButton>
          <MDButton
            variant="outlined"
            color="primary"
            loading={loading}
            disabled={loading}
            onClick={onDismiss}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Cancelar
          </MDButton>
        </MDBox>)}
      </FormikProvider>
      {/*</MDBox>*/}
    </Modal>)
}

export default NewEditViewModal
