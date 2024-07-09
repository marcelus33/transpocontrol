import React, { useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"

import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"

import { useApi } from "utils/helpers"

const ResetPasswordModal = ({ open, onDismiss, initialValues }) => {
  const [loading, setLoading] = useState(false)

  const api = useApi()

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Contraseña es requerida"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Confirmación de contraseña es requerida"),
  })

  const formikInitialValues = {
    password: "",
    confirm_password: "",
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

  const handleFormSubmit = (data) => {
    setLoading(true)

    const userData = {
      password: data.password,
    }

    const userId = initialValues?.id

    api.updateUser(userId, userData).handle({
      onSuccess: () => {
        handleDismiss()
      },
      successMessage: "Se restableció la contraseña con éxito",
      errorMessage: "Ocurrió un error al restablecer la contraseña de este usuario",
      onError: (result) => {
        formik?.setErrors(result.errors)
      },
      onFinally: () => setLoading(false),
    })
  }

  return (
    <Modal title={"Restablecer contraseña"} open={open} handleClose={handleDismiss} maxWidth="sm">
      <FormikProvider value={formik}>
        <MDBox
          sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", gap: 2 }}
        >
          <FormikInput
            name={"password"}
            label={"Contraseña"}
            placeholder={""}
            errors={formik.errors}
            sx={{ flex: 1 }}
            disabled={loading}
          />
          <FormikInput
            name={"confirm_password"}
            label={"Confirmar Contraseña"}
            placeholder={""}
            errors={formik.errors}
            sx={{ flex: 1 }}
            disabled={loading}
          />
        </MDBox>

        <MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={"30px"} mt={4}>
          <MDButton
            variant="outlined"
            color="primary"
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

export default ResetPasswordModal
