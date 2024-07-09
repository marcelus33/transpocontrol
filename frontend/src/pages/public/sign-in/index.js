import { useNavigate } from "react-router-dom"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"
import MDButton from "components/MDUI/MDButton"
import * as Yup from "yup"

// Image
import ROUTES from "routes/routes"
import { observer } from "mobx-react"
import { useStores } from "../../../models"
import { useApi } from "utils/helpers"
import { useRef, useState } from "react"
import { runInAction } from "mobx"
import { FormikProvider, useFormik } from "formik"
import FormikInput from "../../../components/FormInputs/FormikInput"
import AuthLayout from "../../../components/Layout/AuthLayout"
import logo from "assets/images/transpocargo-logo.png"
import truckImage from "assets/images/login-side-image.png"
import { FormControlLabel } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"

const boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3), 0 0 4px rgba(0, 0, 0, 0.1)"

const DUMMY_USER = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  is_superuser: false,
  email: "johndoe@example.com",

  profile_picture: "https://example.com/profile.jpg",

  access_token: "dummy_access_token",
  refresh_token: "dummy_refresh_token",
}

function SignIn() {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const api = useApi()
  const navigate = useNavigate()
  const signInButtonRef = useRef()

  const [loading, setLoading] = useState(false)

  const [rememberMe, setRememberMe] = useState(false)


  const completeLogin = (access, user) => {
    runInAction(() => {
      loginStore.setUser(user)
      loginStore.setApiToken(access)
    })
    navigate(ROUTES.MANAGE_USERS)
  }

  const login = (data) => {
    setLoading(true)
    api.login(data.email, data.password).handle({
      onSuccess: (result) => {
        const { response } = result
        const { user, access } = response
        completeLogin(access, user)
      },
      // onError: (error) => {
      //   console.log("error", error)
      // },
      errorMessage: "Email o contraseña inválidas, por favor intente de nuevo.",
      onFinally: () => setLoading(false),
    })
  }

  const validationSchemaLogin = Yup.object().shape({
    email: Yup.string().email().required("Este campo es requerido"),
    password: Yup.string().required("Este campo es requerido"),
  })

  const initialValuesLogin = {
    email: "",
    password: "",
  }

  const formikLogin = useFormik({
    initialValues: initialValuesLogin,
    validationSchema: validationSchemaLogin,
    onSubmit: (values) => login(values),
    enableReinitialize: true,
  })


  return (
    <MDBox alignItems="center">
      <MDBox component={"img"} position="absolute" sx={{ width: "100%", height: "100%", filter: "blur(8px)" }}
             src={truckImage} />
      <MDBox>
        <AuthLayout>
          <MDBox sx={{ background: "white", opacity: "92%", padding: "40px", borderRadius: 5 }}>
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
              Iniciar Sesión
            </MDTypography>
            <MDBox display={"flex"} justifyContent={"center"} alignItems={"center"} mb={3}>
            </MDBox>
            <>
              <FormikProvider value={formikLogin}>
                <FormikInput
                  name={"email"}
                  label={"Correo"}
                  placeholder={"Ingresa tu correo"}
                  type={"email"}
                  mb={1}
                  errors={formikLogin.errors}
                />
                <FormikInput
                  name={"password"}
                  label={"Contraseña"}
                  placeholder={"Ingresa tu Contraseña"}
                  type={"password"}
                  errors={formikLogin.errors}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      signInButtonRef.current.click()
                    }
                  }}
                />
              </FormikProvider>
              <MDBox display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      color={"primary"}
                      onClick={() => setRememberMe(!rememberMe)}
                    />
                  }
                  label="Recuerdame"
                />
                <MDButton variant={"text"} onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
                  <MDTypography variant="button" color="secondary" fontWeight="regular">
                    Olvidaste tu contraseña?
                  </MDTypography>
                </MDButton>
              </MDBox>
              <MDBox mb={1} textAlign={"center"} mt={2}>
                <MDButton
                  ref={signInButtonRef}
                  variant="contained"
                  color="primary"
                  loading={loading}
                  disabled={loading}
                  onClick={() => formikLogin.handleSubmit()}
                  fullWidth
                >
                  Ingresar
                </MDButton>
              </MDBox>
            </>
          </MDBox>
        </AuthLayout>
      </MDBox>
    </MDBox>
  )
}

export default observer(SignIn)
