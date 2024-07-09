import React, { useEffect, useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"
import { useApi } from "../../../utils/helpers"

const NewEditViewModal = ({ open, onDismiss, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState()

  const isEditing = !!selectedItem
  const isViewing = !!selectedItem?.isViewOnly

  const api = useApi()

  const validationSchema = Yup.object().shape({
    image: Yup.string().notRequired(),
    name: Yup.string().required("Nombre es un campo requerido"),
    ruc: Yup.string()
      .matches(/^(?!.*-\d{2}$)[1-9]\d*[0-9-]*\d$/, "RUC inválido")
      .required("CI / RUC es requerido"),
    address: Yup.string().required("Dirección es un campo requerido"),
    email: Yup.string().email().required("Email es un campo requerido"),
    phone: Yup.string().required("Teléfono es un campo requerido"),
    observation: Yup.string().notRequired(),
  })

  const formikInitialValues = {
    image: initialValues?.image ? initialValues?.image : "",
    name: initialValues?.name ? initialValues?.name : "",
    ruc: initialValues?.ruc ? initialValues?.ruc : "",
    address: initialValues?.address ? initialValues?.address : "",
    email: initialValues?.email ? initialValues?.email : "",
    phone: initialValues?.phone ? initialValues?.phone : "",
    observation: initialValues?.observation ? initialValues?.observation : "",
  }

  const formik = useFormik({
    initialValues: formikInitialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => handleFormSubmit(values),
    enableReinitialize: true,
  })

  const handleDismiss = () => {
    if (loading) return

    formik.resetForm()
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getSupplier(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        setInitialValues(results)
      },
      errorMessage: "Ocurrió un problema al obtener los datos del proveedor",
      onFinally: () => setLoading(false),
    })
  }

  const handleFormSubmit = (data) => {
    setLoading(true)

    const itemData = {
      ...data,
      city: data.city?.id,
    }

    if (!itemData?.image) {
      itemData.image = null
    }

    if (isEditing) {
      const itemId = initialValues?.id
      api.updateSupplier(itemId, itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Proveedor guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este proveedor",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      api.createSupplier(itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Proveedor guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este proveedor",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    }
  }

  useEffect(() => {
    if (open && selectedItem) {
      const itemId = selectedItem?.id
      getItem(itemId)
    }

    return () => {
      setInitialValues(null)
    }
  }, [open, selectedItem])

  let modalTitle = "Crear nuevo proveedor"
  if (isEditing) modalTitle = "Editar proveedor"
  if (isViewing) modalTitle = "Ver proveedor"

  return (
    <Modal title={modalTitle} open={open} handleClose={handleDismiss} maxWidth="md">
      <FormikProvider value={formik}>
        <MDBox
          sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
        >
          <MDBox
            sx={{
              margin: "0 0.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "top",
            }}
          >
            <FormikInput
              name={"image"}
              label={"Imagen"}
              placeholder={""}
              errors={formik.errors}
              type="file"
              disabled={isViewing || loading}
            />
          </MDBox>
          <MDBox sx={{ flex: 1 }}>
            <MDBox
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
            >
              <FormikInput
                name={"name"}
                label={"Nombre"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
            </MDBox>

            <MDBox
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
            >
              <FormikInput
                name={"address"}
                label={"Dirección"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
              <FormikInput
                name={"ruc"}
                label={"C.I. / RUC"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
            </MDBox>
            <MDBox
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
            >
              <FormikInput
                name={"phone"}
                label={"Teléfono"}
                placeholder={""}
                type="phone_input"
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
              <FormikInput
                name={"email"}
                label={"Email"}
                placeholder={""}
                type="email"
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        <FormikInput
          name={"observation"}
          label={"Observación"}
          placeholder={""}
          type="textarea"
          errors={formik.errors}
          sx={{ flex: 1, mb: 2 }}
          disabled={isViewing || loading}
        />

        <MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={2} pt={2}>
          <MDButton
            variant="outlined"
            color="primary"
            loading={loading}
            disabled={loading}
            onClick={handleDismiss}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Cancelar
          </MDButton>
          <MDButton
            variant="contained"
            color="primary"
            loading={loading}
            disabled={loading}
            onClick={() => formik.handleSubmit()}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Guardar
          </MDButton>
        </MDBox>
      </FormikProvider>
    </Modal>
  )
}

export default NewEditViewModal
