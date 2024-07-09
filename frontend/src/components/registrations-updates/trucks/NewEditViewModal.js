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

  const [loadingOwnersList, setLoadingOwnersList] = useState(false)
  const [ownersListOptions, setOwnersListOptions] = useState([])

  const [loadingDriversList, setLoadingDriversList] = useState(false)
  const [driversListOptions, setDriversListOptions] = useState([])

  const [loadingClientsList, setLoadingClientsList] = useState(false)
  const [clientsListOptions, setClientsListOptions] = useState([])

  const [initialValues, setInitialValues] = useState()

  const isEditing = !!selectedItem
  const isViewing = !!selectedItem?.isViewOnly

  const api = useApi()

  const validationSchema = Yup.object().shape({
    image: Yup.string().notRequired(),
    owner: Yup.object()
      .shape({
        id: Yup.number().required("El ID del Propietario es requerido"),
      })
      .required("Propietario es requerido"),

    authorized_company: Yup.object()
      .shape({
        id: Yup.number().required("El ID de la Cliente Habilitado es requerido"),
      })
      .required("Cliente Habilitado es requerido"),
    driver: Yup.object()
      .shape({
        id: Yup.number().required("El ID del conductor es requerido"),
      })
      .required("Conductor es requerido"),

    brand: Yup.string().required("Marca es requerido"),
    type: Yup.string().required("Tipo es requerido"),
    year: Yup.number().required("Año es requerido").min(1901, "El año debe ser mayor que 1900"),

    axles: Yup.number().required("Ejes es requerido"),
    plate: Yup.string().required("Patente es requerido"),
    body: Yup.string().required("Carrocería es requerido"),

    chassis: Yup.string().required("Chasis es requerido"),
    load_capacity: Yup.string().required("Carga es requerido"),
    vehicle_no: Yup.string().required("Nro de Coche es requerido"),

    observation: Yup.string().notRequired(),
  })

  const formikInitialValues = {
    image: initialValues?.image ? initialValues?.image : "",

    owner: null,
    authorized_company: null,
    driver: null,
    brand: initialValues?.brand ? initialValues.brand : "",
    type: initialValues?.type ? initialValues.type : "",
    year: initialValues?.year ? initialValues.year : "",
    axles: initialValues?.axles ? initialValues.axles : "",
    plate: initialValues?.plate ? initialValues.plate : "",
    body: initialValues?.body ? initialValues.body : "",
    chassis: initialValues?.chassis ? initialValues.chassis : "",
    load_capacity: initialValues?.load_capacity ? initialValues.load_capacity : "",
    vehicle_no: initialValues?.vehicle_no ? initialValues.vehicle_no : "",
    observation: initialValues?.observation ? initialValues.observation : "",
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
    setOwnersListOptions([])
    setDriversListOptions([])
    setInitialValues(null)
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getTruck(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        setInitialValues(results)

        setTimeout(() => formik.setFieldValue("owner", results.owner), 500)
        setTimeout(
          () => formik.setFieldValue("authorized_company", results.authorized_company),
          500
        )
        setTimeout(() => formik.setFieldValue("driver", results.driver), 500)
      },
      errorMessage: "Ocurrió un problema al obtener los datos de la empresa",
      onFinally: () => setLoading(false),
    })
  }

  const getOwnersList = useCallback((searchTerm) => {
    if (!searchTerm) setLoadingOwnersList(true)
    const params = {
      page: 1,
      search: searchTerm || undefined,
    }
    api.getOwners(params).handle({
      onSuccess: (response) => {
        const results = response?.data?.results
        setOwnersListOptions(
          results.map((item) => ({
            ...item,
            id: item.id,
            name: item.name,
          }))
        )
      },
      errorMessage: "Ocurrió un problema al obtener la lista de propietarios",
      onFinally: () => !searchTerm && setLoadingOwnersList(false),
    })
  }, [])

  const getClientsList = useCallback((searchTerm) => {
    if (!searchTerm) setLoadingClientsList(true)
    const params = {
      page: 1,
      search: searchTerm || undefined,
    }
    api.getOwners(params).handle({
      onSuccess: (response) => {
        const results = response?.data?.results
        setClientsListOptions(
          results.map((item) => ({
            ...item,
            id: item.id,
            name: item.name,
          }))
        )
      },
      errorMessage: "Ocurrió un problema al obtener la lista de clientes",
      onFinally: () => !searchTerm && setLoadingClientsList(false),
    })
  }, [])

  const getDriversList = useCallback((searchTerm) => {
    if (!searchTerm) setLoadingDriversList(true)
    const params = {
      page: 1,
      search: searchTerm || undefined,
    }
    api.getDrivers(params).handle({
      onSuccess: (response) => {
        const results = response?.data?.results
        setDriversListOptions(
          results.map((item) => ({
            ...item,
            id: item.id,
            name: item.name,
          }))
        )
      },
      errorMessage: "Ocurrió un problema al obtener la lista de choferes",
      onFinally: () => !searchTerm && setLoadingDriversList(false),
    })
  }, [])

  const handleFormSubmit = (data) => {
    setLoading(true)

    const itemData = {
      ...data,
      driver: data.driver?.id,
      owner: data.owner?.id,
      authorized_company: data.authorized_company?.id,
    }

    if (!itemData?.image) {
      itemData.image = null
    }

    if (isEditing) {
      const itemId = initialValues?.id
      api.updateTruck(itemId, itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Tractocamión guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este tractocamión",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      api.createTruck(itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Tractocamión guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este tractocamión",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    }
  }

  useEffect(() => {
    if (open) {
      getOwnersList()
      getDriversList()
      getClientsList()
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

  let modalTitle = "Crear nuevo tractocamión"
  if (isEditing) modalTitle = "Editar tractocamión"
  if (isViewing) modalTitle = "Ver tractocamión"

  return (
    <Modal title={modalTitle} open={open} handleClose={handleDismiss} maxWidth="md">
      <FormikProvider value={formik}>
        <MDBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
              <FormikInput
                name={"owner"}
                label={"Propietario"}
                placeholder={""}
                errors={formik.errors}
                type="autocomplete"
                sx={{ flex: 1, mb: 2 }}
                options={ownersListOptions}
                disabled={loadingOwnersList || loading || isViewing}
                filterOptions={(x) => x}
                onInputChange={(value) => {
                  getOwnersList(value)
                }}
              />

              <FormikInput
                name={"authorized_company"}
                label={"Cliente Habilitado"}
                placeholder={""}
                errors={formik.errors}
                type="autocomplete"
                sx={{ flex: 1, mb: 2 }}
                options={clientsListOptions}
                disabled={loadingClientsList || loading || isViewing}
                filterOptions={(x) => x}
                onInputChange={(value) => {
                  getClientsList(value)
                }}
              />
              <FormikInput
                name={"driver"}
                label={"Chofer"}
                placeholder={""}
                errors={formik.errors}
                type="autocomplete"
                sx={{ flex: 1, mb: 2 }}
                options={driversListOptions}
                disabled={loadingDriversList || loading || isViewing}
                filterOptions={(x) => x}
                onInputChange={(value) => {
                  getDriversList(value)
                }}
              />
            </MDBox>
          </MDBox>

          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 2,
              alignItems: "center",
            }}
          >
            <FormikInput
              name={"brand"}
              label={"Marca"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />

            <FormikInput
              name={"type"}
              label={"Tipo"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
            <FormikInput
              name={"year"}
              label={"Año"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              type="number"
              disabled={isViewing || loading}
            />
          </MDBox>

          <MDBox
            sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
          >
            <FormikInput
              name={"axles"}
              label={"Ejes"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              type="number"
              disabled={isViewing || loading}
            />
            <FormikInput
              name={"plate"}
              label={"Patente"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
            <FormikInput
              name={"body"}
              label={"Carroceria"}
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
              name={"chassis"}
              label={"Chasis"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
            <FormikInput
              name={"load_capacity"}
              label={"Carga"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
            <FormikInput
              name={"vehicle_no"}
              label={"Coche No."}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
          </MDBox>

          <FormikInput
            name={"observation"}
            label={"Observación"}
            placeholder={""}
            type="textarea"
            errors={formik.errors}
            sx={{ flex: 1 }}
            disabled={isViewing || loading}
            rows={isViewing && 10}
          />
        </MDBox>

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
              disabled={loading}
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
