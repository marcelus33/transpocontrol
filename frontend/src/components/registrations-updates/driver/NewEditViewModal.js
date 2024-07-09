import React, { useEffect, useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"
import { useApi } from "utils/helpers"
import { GENDER } from "utils/constants"
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded"
import colors from "assets/theme/base/colors"

const NewEditViewModal = ({ open, onDismiss, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState()

  const isEditing = !!selectedItem
  const isViewing = !!selectedItem?.isViewOnly

  const api = useApi()

  const validationSchema = Yup.object().shape({
    image: Yup.string().notRequired(),
    contract: Yup.string().notRequired(),
    attach_contract: Yup.boolean().notRequired(),
    name: Yup.string().required("Nombre es requerido"),
    gender: Yup.object()
      .shape({
        id: Yup.string().required("El ID del sexo es requerido"),
      })
      .required("Sexo es requerido"),
    birthday: Yup.date().required("Fecha de nacimiento es requerido"),
    id_number: Yup.string()
      .matches(/^[1-9]\d{5,}$/, "CI / Documento inválido")
      .required("CI / Documento es requerido"),
    ruc: Yup.string()
      .matches(/^(?!.*-\d{2}$)[1-9]\d*[0-9-]*\d$/, "RUC inválido")
      .required("CI / RUC es requerido"),
    address: Yup.string().required("Dirección es requerido"),
    phone: Yup.string().required("Teléfono es requerido"),
    email: Yup.string()
      .email("Formato de correo electrónico no válido")
      .required("Correo electrónico es requerido"),
    observation: Yup.string().notRequired(),
  })

  const formikInitialValues = {
    image: initialValues?.image ? initialValues?.image : "",
    contract: initialValues?.contract ? initialValues?.contract : "",
    attach_contract: initialValues?.attach_contract ? initialValues?.attach_contract : false,
    name: initialValues?.name ? initialValues?.name : "",
    gender: null,
    birthday: initialValues?.birthday ? initialValues?.birthday : "",
    id_number: initialValues?.id_number ? initialValues?.id_number : "",
    ruc: initialValues?.ruc ? initialValues?.ruc : "",
    address: initialValues?.address ? initialValues?.address : "",
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
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getDriver(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        if (results.contract) {
          result.attach_contract = true
        }
        setInitialValues(results)

        const gender = GENDER.find((item) => item.id === results?.gender)
        setTimeout(() => formik.setFieldValue("gender", gender), 500)
      },
      errorMessage: "Ocurrió un problema al obtener los datos del chofer",
      onFinally: () => setLoading(false),
    })
  }

  const handleFormSubmit = (data) => {
    setLoading(true)
    const itemData = {
      ...data,
      gender: data.gender?.id,
    }

    if (!itemData?.image) {
      itemData.image = null
    }

    if (!itemData?.contract) {
      itemData.contract = null
    }

    if (isEditing) {
      const itemId = initialValues?.id
      api.updateDriver(itemId, itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Chofer guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este chofer",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      api.createDriver(itemData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Chofer guardada con éxito",
        errorMessage: "Ocurrió un error al guardar este chofer",
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

  let modalTitle = "Crear nuevo chofer"
  if (isEditing) modalTitle = "Editar chofer"
  if (isViewing) modalTitle = "Ver chofer"

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
            <FormikInput
              name={"name"}
              label={"Nombre"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={isViewing || loading}
            />
            <MDBox
              sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
            >
              <FormikInput
                name={"ruc"}
                label={"R.U.C."}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
              <FormikInput
                name={"gender"}
                label={"Sexo"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                type="autocomplete"
                options={GENDER}
                disabled={isViewing || loading || isViewing}
              />
            </MDBox>
            <MDBox
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <FormikInput
                name={"id_number"}
                label={"C.I. / Documento"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                disabled={isViewing || loading}
              />
              <FormikInput
                name={"birthday"}
                label={"Cumpleaños"}
                placeholder={""}
                errors={formik.errors}
                sx={{ flex: 1, mb: 2 }}
                type="date"
                disabled={isViewing || loading}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        <FormikInput
          name={"email"}
          label={"Correo"}
          placeholder={""}
          type="email"
          errors={formik.errors}
          sx={{ flex: 1, mb: 2 }}
          disabled={isViewing || loading}
        />

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
            name={"phone"}
            label={"Teléfono"}
            placeholder={""}
            type="phone_input"
            errors={formik.errors}
            sx={{ flex: 1, mb: 2 }}
            disabled={isViewing || loading}
          />
        </MDBox>

        <MDBox
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mb: 4,
            gap: 2,
          }}
        >
          <FormikInput
            name={"attach_contract"}
            label={"Adjuntar contrato?"}
            placeholder={""}
            type="checkbox"
            errors={formik.errors}
            sx={{ flex: 1, mb: 2 }}
            disabled={isViewing || loading}
          />
          {formik.values?.attach_contract && (
            <FormikInput
              name={"contract"}
              label={"Imagen"}
              placeholder={""}
              errors={formik.errors}
              type="file"
              disabled={isViewing || loading}
              icon={<UploadFileRoundedIcon fontSize="large" />}
              containerSx={{
                borderStyle: "dashed",
                borderColor: colors.black.main,
                borderWidth: 3,
                width: "100%",
              }}
              previewOnNewTab
            />
          )}
        </MDBox>

        <FormikInput
          name={"observation"}
          label={"Observación"}
          placeholder={""}
          type="textarea"
          errors={formik.errors}
          sx={{ flex: 1 }}
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
