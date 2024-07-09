/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.2.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// Material Dashboard 2 PRO React components
import MDBox from 'components/MDUI/MDBox'
import MDTypography from 'components/MDUI/MDTypography'
import MDButton from 'components/MDUI/MDButton'
import MDInput from 'components/MDUI/MDInput'
import { showMessage, useApi } from 'utils/helpers'
import * as Yup from 'yup'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from '../FormikInput'
import { useState } from 'react'

function ChangePasswordSettings() {
  const api = useApi()
  const [loading, setLoading] = useState(false)

  const signUp = (data) => {
    setLoading(true)

    api
      .changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      })

      .handle({
        onSuccess: () => {
          formikSignUp.resetForm()
        },
        successMessage: 'Tu contraseña ha sido actualizada',
        errorMessage: 'Error al intentar cambiar la contraseña',
        onFinally: () => setLoading(false),
      })
  }

  const initialValuesSignUp = {
    current_password: '',
    new_password: '',
    new_password2: '',
  }

  const validationSchemaSignup = Yup.object().shape({
    current_password: Yup.string().required('Your current password is required'),
    new_password: Yup.string()
      .required('Password is required')
      .min(9, 'Must be more than 8 characters') // at least 9 characters
      .matches(/[A-Z]/, 'Must contain at least one capital letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    new_password2: Yup.string()
      .oneOf([Yup.ref('new_password')], 'Passwords must match')
      .required('Confirm Password is a required field'),
  })

  const formikSignUp = useFormik({
    initialValues: initialValuesSignUp,
    validateOnChange: false,
    validationSchema: validationSchemaSignup,
    onSubmit: (values) => {
      signUp(values)
      console.log('Form values submitted:', values)
    },
    enableReinitialize: true,
  })

  return (
    <Card id="change-password">
      <MDBox p={3}>
        <MDTypography variant="h5">Change Password</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <FormikProvider value={formikSignUp}>
          <FormikInput
            name={'current_password'}
            label={'Current Password'}
            placeholder={'Type your current password'}
            type={'password'}
            errors={formikSignUp.errors}
            mb={1}
          />
          <FormikInput
            name={'new_password'}
            label={'Password'}
            placeholder={'Create a strong password'}
            type={'password'}
            errors={formikSignUp.errors}
            mb={1}
          />
          {/*<p style={styles.passwordText}>*/}
          {/*  Must be more than <span style={styles.blackText}>8 characters</span> and contain at least <span*/}
          {/*  style={styles.blackText}>one capital letter, one number </span> and <span style={styles.blackText}>one special character</span>*/}
          {/*</p>*/}
          <FormikInput
            name={'new_password2'}
            label={'Confirm password'}
            placeholder={'Confirm your password'}
            type={'password'}
            errors={formikSignUp.errors}
          />
          <MDBox mb={1} textAlign={'center'} mt={2}>
            <MDButton
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading || !formikSignUp.isValid}
              onClick={() => {
                formikSignUp.handleSubmit()
              }}
              fullWidth
            >
              Update Password
            </MDButton>
          </MDBox>
        </FormikProvider>
      </MDBox>
    </Card>
  )
}

export default ChangePasswordSettings
