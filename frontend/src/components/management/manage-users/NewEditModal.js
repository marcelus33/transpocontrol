import React, { useCallback, useEffect, useState } from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import { Divider } from "@mui/material"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"
import MDTypography from "components/MDUI/MDTypography"
import { useApi } from "utils/helpers"
import moment from "moment"

const NewEditModal = ({ open, onDismiss, selectedItem }) => {
  const [loading, setLoading] = useState(false)
  const [loadingGroupList, setLoadingGroupList] = useState(false)
  const [groupListOptions, setGroupListOptions] = useState([])
  const [initialValues, setInitialValues] = useState()

  const isEditing = !!initialValues

  const api = useApi()

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato de correo electrónico no válido")
      .required("Correo electrónico es requerido"),
    password: isEditing
      ? Yup.string().optional()
      : Yup.string().required("Contraseña es requerida"),
    confirm_password: isEditing
      ? Yup.string().optional()
      : Yup.string()
          .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
          .required("Confirmación de contraseña es requerida"),
    name: Yup.string().required("Nombre es requerido"),
    date_joined: Yup.date().optional(),
    // TODO: 07-04 Rename this field
    date_deleted: Yup.date().optional(),
    groups: Yup.object()
      .shape({
        id: Yup.number().required("El ID del grupo es requerido"),
      })
      .required("Grupo es requerido"),
  })

  const formikInitialValues = {
    email: initialValues?.email ? initialValues.email : "",
    password: initialValues?.password ? initialValues.password : "",
    confirm_password: "",
    name: initialValues?.name ? initialValues.name : "",
    date_joined: initialValues?.date_joined
      ? initialValues.date_joined
      : moment().format("YYYY-MM-DD"),
    // TODO: 07-04 Rename this field
    date_deleted: initialValues?.date_deleted ? initialValues?.date_deleted : "",
    groups: initialValues?.groups?.length ? initialValues.groups[0] : null,
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
    setGroupListOptions([])
    setInitialValues(null)
    onDismiss()
  }

  const getItem = (itemId) => {
    setLoading(true)
    api.getUser(itemId).handle({
      onSuccess: (response) => {
        const results = response?.data
        setInitialValues(results)
      },
      errorMessage: "Ocurrió un problema al obtener los datos del usuario",
      onFinally: () => setLoading(false),
    })
  }

  const getGroupsList = useCallback(() => {
    setLoadingGroupList(true)
    api.getGroups().handle({
      onSuccess: (result) => {
        const { response } = result
        setGroupListOptions(
          response.map((item) => ({
            ...item,
            id: item.id,
            name: item.name,
          }))
        )
      },
      errorMessage: "Ocurrió un problema al obtener la lista de grupos",
      onFinally: () => setLoadingGroupList(false),
    })
  }, [])

  const handleFormSubmit = (data) => {
    setLoading(true)

    const userData = {
      ...data,
      username: data.email,
      groups: [data.groups.id],
      date_joined: data.date_joined.substring(0, 10),
    }

    delete userData.confirm_password

    if (isEditing) {
      const userId = initialValues?.id

      delete userData.password

      api.updateUser(userId, userData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Usuario guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este usuario",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    } else {
      // TODO: 07-04 Rename this field
      delete userData.date_deleted
      api.createUser(userData).handle({
        onSuccess: () => {
          handleDismiss()
        },
        successMessage: "Usuario guardado con éxito",
        errorMessage: "Ocurrió un error al guardar este usuario",
        onError: (result) => {
          formik?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false),
      })
    }
  }

  useEffect(() => {
    if (open) {
      getGroupsList()
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

  return (
    <Modal
      title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
      open={open}
      handleClose={handleDismiss}
      maxWidth="md"
    >
      <FormikProvider value={formik}>
        <FormikInput
          name={"email"}
          label={"Correo"}
          placeholder={""}
          errors={formik.errors}
          sx={{ flex: 1, mb: 2 }}
          disabled={loading}
        />

        {!isEditing && (
          <MDBox
            sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
          >
            <FormikInput
              name={"password"}
              label={"Contraseña"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={loading}
            />
            <FormikInput
              name={"confirm_password"}
              label={"Confirmar Contraseña"}
              placeholder={""}
              errors={formik.errors}
              sx={{ flex: 1, mb: 2 }}
              disabled={loading}
            />
          </MDBox>
        )}

        <Divider />
        <MDTypography sx={{ marginBottom: 2, marginLeft: 1 }}>Datos del usuario</MDTypography>
        <FormikInput
          name={"name"}
          label={"Nombre completo"}
          placeholder={""}
          errors={formik.errors}
          sx={{ flex: 1, mb: 2 }}
          disabled={loading}
        />
        <MDBox
          sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2 }}
        >
          <FormikInput
            name={"date_joined"}
            label={"Alta"}
            placeholder={""}
            type="date"
            errors={formik.errors}
            disabled={true}
            sx={{ flex: 1, mb: 2 }}
          />
          <FormikInput
            // TODO: 07-04 Rename this field
            name={"date_deleted"}
            label={"Baja"}
            placeholder={""}
            type="date"
            errors={formik.errors}
            disabled={true}
            sx={{ flex: 1, mb: 2 }}
          />
        </MDBox>

        <Divider />
        <MDTypography sx={{ marginBottom: 2, marginLeft: 1 }}>Permisos del usuario</MDTypography>
        <FormikInput
          name="groups"
          label={"Rol"}
          placeholder={""}
          type="autocomplete"
          options={groupListOptions}
          errors={formik.errors}
          disabled={loadingGroupList || loading}
        />
        <MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={"30px"} mt={4}>
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

export default NewEditModal
