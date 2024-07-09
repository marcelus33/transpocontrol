import React, { useCallback, useEffect, useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"
import { useApi } from "utils/helpers"

const NewEditViewModal = ({ open, onDismiss, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [loadingCitiesList, setLoadingCitiesList] = useState(false)
  const [citiesListOptions, setCitiesListOptions] = useState([])
  const [initialValues, setInitialValues] = useState()

  const isEditing = !!selectedItem
  const isViewing = !!selectedItem?.isViewOnly

  const api = useApi()

  const validationSchema = Yup.object().shape({
    image: Yup.string().notRequired(),
    name: Yup.string().required("Nombre es requerido"),
    legal_denomination: Yup.string().required("Denominación Legal es requerido"),
    ruc: Yup.string()
      .matches(/^(?!.*-\d{2}$)[1-9]\d*[0-9-]*\d$/, "RUC inválido")
      .required("CI / RUC es requerido"),
    address: Yup.string().required("Dirección es requerido"),
    city: Yup.object()
      .shape({
        id: Yup.number().required("El ID de la ciudad es requerido"),
      })
      .required("Ciudad es requerido"),
    phone: Yup.string().required("Teléfono es requerido"),
    email: Yup.string()
      .email("Formato de correo electrónico no válido")
      .required("Correo electrónico es requerido"),
    observation: Yup.string().notRequired(),
  })

  const formikInitialValues = {
    image: initialValues?.image ? initialValues?.image : "",
    name: initialValues?.name ? initialValues?.name : "",
    legal_denomination: initialValues?.legal_denomination ? initialValues?.legal_denomination : "",
    ruc: initialValues?.ruc ? initialValues?.ruc : "",
    address: initialValues?.address ? initialValues?.address : "",
    city: null,
    phone: initialValues?.phone ? initialValues?.phone : "",
    email: initialValues?.email ? initialValues?.email : "",
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
    setCitiesListOptions([])
    setInitialValues(null)
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getClient(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        setInitialValues(results)

        setTimeout(() => formik.setFieldValue("city", results.city), 500)
      },
      errorMessage: "Ocurrió un problema al obtener los datos del cliente",
      onFinally: () => setLoading(false),
    })
  }

  const getCitiesList = useCallback((searchTerm) => {
    if (!searchTerm) setLoadingCitiesList(true)
    const params = {
      page: 1,
      search: searchTerm || undefined,
    }
    api.getCities(params).handle({
      onSuccess: (response) => {
        const results = response?.data?.results
        setCitiesListOptions(
          results.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        )
      },
      errorMessage: "Ocurrió un problema al obtener la lista de ciudades",
      onFinally: () => !searchTerm && setLoadingCitiesList(false),
    })
  }, [])

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
      api.updateClient(itemId, itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Cliente guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este cliente",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      api.createClient(itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Cliente guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este cliente",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    }
  }

  useEffect(() => {
    if (open) {
      getCitiesList()
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

  let modalTitle = "Crear nuevo cliente"
  if (isEditing) modalTitle = "Editar cliente"
  if (isViewing) modalTitle = "Ver cliente"

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
                disabled={isViewing}
              />
            </MDBox>

            <MDBox
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
            >
              <FormikInput
                name={"legal_denomination"}
                label={"Denominación Legal"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing}
              />
              <FormikInput
                name={"ruc"}
                label={"C.I. / RUC"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing}
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
                disabled={isViewing}
              />
              <FormikInput
                name={"city"}
                label={"Ciudad"}
                placeholder={""}
                errors={formik.errors}
                type="autocomplete"
                sx={{ flex: 1, mb: 2 }}
                options={citiesListOptions}
                disabled={loadingCitiesList || loading || isViewing}
                filterOptions={(x) => x}
                onInputChange={(value) => {
                  getCitiesList(value)
                }}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        <MDBox
          sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
        >
          <FormikInput
            name={"phone"}
            label={"Teléfono"}
            type="phone_input"
            placeholder={""}
            errors={formik.errors}
            sx={{ flex: 1, mb: 2 }}
            disabled={isViewing}
          />
          <FormikInput
            name={"email"}
            label={"Email"}
            placeholder={""}
            type="email"
            errors={formik.errors}
            sx={{ flex: 1, mb: 2 }}
            disabled={isViewing}
          />
        </MDBox>

        <FormikInput
          name={"observation"}
          label={"Observación"}
          placeholder={""}
          type="textarea"
          errors={formik.errors}
          sx={{ flex: 1, mb: 2 }}
          disabled={isViewing}
          rows={isViewing && 10}
        />

        {!isViewing && (
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
              disabled={loadingCitiesList || loading}
              onClick={() => formik.handleSubmit()}
              sx={{ borderRadius: 20, minWidth: "120px" }}
              size={"large"}
            >
              Guardar
            </MDButton>
          </MDBox>
        )}
      </FormikProvider>
    </Modal>
  )
}

export default NewEditViewModal
