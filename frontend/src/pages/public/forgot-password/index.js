import { useNavigate } from "react-router-dom"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDButton from "components/MDUI/MDButton"
import * as Yup from "yup"

import ROUTES from "routes/routes"
import { useRef, useState } from "react"
import { showMessage, useApi, useIsMobile } from "utils/helpers"
import { FormikProvider, useFormik } from "formik"
import { observer } from "mobx-react"
import FormikInput from "../../../components/FormInputs/FormikInput"
import AuthLayout from "../../../components/Layout/AuthLayout"
import MDTypography from "../../../components/MDUI/MDTypography"
import truckImage from "../../../assets/images/login-side-image.png"
import logo from "../../../assets/images/transpocargo-logo.png"
import colors from "../../../assets/theme/base/colors"

const boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 4px rgba(0, 0, 0, 0.1)"

function ForgotPassword() {
  const api = useApi()
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const formikRef = useRef()
  const [loading, setLoading] = useState(false)

  const forgotPassword = (data) => {
    setLoading(true)
    api
      .forgotPassword(data.email)
      .then((result) => {
        if (result.kind === "ok") {
          showMessage("Email de recuperación ha sido enviado.", "success")
          navigate(ROUTES.LOGIN)
        } else if (result.kind === "bad-data") {
          formikRef.current.setErrors(result.errors)
          showMessage(result.errors.details)
        } else {
          showMessage()
        }
      })
      .catch((err) => showMessage(err.message))
      .finally(() => setLoading(false))
  }

  const validationSchemaLogin = Yup.object().shape({
    email: Yup.string().email().required("Este campo es requerido"),
  })

  const initialValuesLogin = {
    email: "",
  }

  const formikLogin = useFormik({
    initialValues: initialValuesLogin,
    validationSchema: validationSchemaLogin,
    onSubmit: (values) => forgotPassword(values),
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
              Recuperar Contraseña
            </MDTypography>
            <MDBox display={"flex"} justifyContent={"center"} alignItems={"center"} mb={3}>
            </MDBox>
            <>
              <FormikProvider value={formikLogin}>
                <MDTypography>
                  Ingresa tu direccion de correo electronico y te enviaremos un email con instrucciones para recuperar
                  tu contraseña.
                </MDTypography>
                <FormikInput
                  name={"email"}
                  label={"Correo"}
                  placeholder={"Ingresa tu correo"}
                  type={"email"}
                  mb={1}
                  errors={formikLogin.errors}
                  sx={{
                    paddingTop: 2,
                  }}
                />
                <MDBox display={"flex"} justifyContent={"end"} alignItems={"center"}>
                  <MDButton variant={"text"} onClick={() => navigate(ROUTES.LOGIN)}>
                    <MDTypography variant="button" sx={{ color: colors.primary.focus }} fontWeight="regular">
                      Iniciar Sesión
                    </MDTypography>
                  </MDButton>
                </MDBox>
                <MDBox mb={1} textAlign={"center"} mt={2}>
                  <MDButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    disabled={loading}
                    onClick={() => formikLogin.handleSubmit()}
                    fullWidth
                  >
                    Recuperar Contraseña
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

export default observer(ForgotPassword)
