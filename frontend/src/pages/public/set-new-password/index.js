/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// react-router-dom components
import { useNavigate } from "react-router-dom"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"
import MDButton from "components/MDUI/MDButton"

import ROUTES from "routes/routes"
import { observer } from "mobx-react"
import { showMessage, useApi, useIsMobile } from "utils/helpers"
import { useRef, useState } from "react"
import * as Yup from "yup"
import { FormikProvider, useFormik } from "formik"
import FormikInput from "../../../components/FormInputs/FormikInput"
import AuthLayout from "../../../components/Layout/AuthLayout"
import truckImage from "../../../assets/images/login-side-image.png"
import logo from "../../../assets/images/transpocargo-logo.png"

function SetNewPassword() {
  const api = useApi()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const formikRef = useRef()
  const [loading, setLoading] = useState(false)
  const getUrls = window.location.href.split("set-new-password/")[1].split("/")

  const resetPassword = (data) => {
    const form = {
      new_password: data.password,
      uidb64: getUrls[0],
      token: getUrls[1],
    }
    setLoading(true)
    api
      .resetPassword(form)
      .then((result) => {
        if (result.kind === "ok") {
          showMessage("Cambio de contraseña exitosa", "success")
          navigate(ROUTES.LOGIN)
        } else if (result.kind === "bad-data") {
          if (result.errors.token) {
            showMessage(result.errors.token)
          } else {
            showMessage(result.errors?.errors)
            formikRef.current.setErrors(result.errors)
          }
        } else showMessage()
      })
      .catch((err) => showMessage())
      .finally(() => setLoading(false))
  }

  const validationSchemaSetNewPassword = Yup.object().shape({
    password: Yup.string().required("Este campo es requerido"),
    new_password2: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], "Passwords doesn't match"),
  })

  const initialValuesSetNewPassword = {
    password: "",
    new_password2: "",
  }

  const formikLogin = useFormik({
    initialValues: initialValuesSetNewPassword,
    validationSchema: validationSchemaSetNewPassword,
    onSubmit: (values) => resetPassword(values),
    enableReinitialize: true,
  })

  return (
    <MDBox sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
      <MDBox item component={"img"} position="absolute" sx={{ width: "100%", height: "100%", filter: "blur(8px)" }}
             src={truckImage} />
      <MDBox>
        <AuthLayout>
          <MDBox sx={{ background: "white", opacity: "92%", padding: "40px", borderRadius: 5, width: "100%" }}>
            <MDBox
              component="img"
              src={logo}
              alt={"logo"}
              width="100%"
              maxWidth={318}
              display={"flex"}
              margin={"auto"}
            />
            <MDTypography mt={2} variant="h4" textAlign="center">
              Cree una nueva contraseña para continuar
            </MDTypography>
            <MDBox display={"flex"} justifyContent={"center"} alignItems={"center"} mb={3}>
            </MDBox>
            <>
              <FormikProvider value={formikLogin}>
                <FormikInput
                  name={"password"}
                  label={"Nueva Contraseña"}
                  placeholder={"Ingrese su nueva contraseña"}
                  type={"password"}
                  mb={1}
                  errors={formikLogin.errors}
                  sx={{
                    paddingTop: 2,
                  }}
                />
                <FormikInput
                  name={"new_password2"}
                  label={"Confirmar Nueva Contraseña"}
                  placeholder={"Vuelva a ingresar su nueva contraseña"}
                  type={"password"}
                  mb={1}
                  errors={formikLogin.errors}
                  sx={{
                    paddingTop: 2,
                  }}
                />
                <MDBox mb={1} textAlign={"center"} mt={2}>
                  <MDButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    disabled={loading}
                    onClick={() => formikLogin.handleSubmit()}
                    fullWidth
                  >
                    Cambiar Contraseña
                  </MDButton>
                </MDBox>
              </FormikProvider>
            </>
          </MDBox>
        </AuthLayout>
      </MDBox>
    </MDBox>
  )
}

export default observer(SetNewPassword)
