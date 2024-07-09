import React from "react"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

import { Modal } from "components/MDUI/Modal"
import FormikInput from "components/FormInputs/FormikInput"
import MDBox from "components/MDUI/MDBox"
import MDButton from "../../MDUI/MDButton"

const NewExpenseModal = ({ open, onDismiss, addNewExpense, }) => {

  const validationSchemaExpense = Yup.object().shape({
    description: Yup.string().required("Descripción es un campo requerido"),
    sender_amount: Yup.object().shape({
      amount: Yup.number().required("Monto es un campo requerido"),
      currency: Yup.string().default("PYG").notRequired(),
    }),
    recipient_amount: Yup.object().shape({
      amount: Yup.number().required("Monto es un campo requerido"),
      currency: Yup.string().default("PYG").notRequired(),
    }),
  })

  const initialValuesExpense = {
    description: "",
    sender_amount: { amount: 0, currency: "USD"},
    recipient_amount: { amount: 0, currency: "USD"},
    total:0
  }

  const handleExpenseSubmit = (values) => {
    addNewExpense({...values, total: parseFloat(values.sender_amount.amount + values.recipient_amount.amount)})
    handleExpenseDismiss()
  }


  const handleExpenseDismiss = (values) => {
    onDismiss()
    formikExpense.resetForm()
  }

  const formikExpense = useFormik({
    initialValues: initialValuesExpense,
    validationSchema: validationSchemaExpense,
    onSubmit: handleExpenseSubmit,
    enableReinitialize: true,
  })

  return (
    <Modal
      title={"Nuevo Gasto"}
      open={open}
      handleClose={handleExpenseDismiss}
      maxWidth="md"
    >
      <FormikProvider value={formikExpense}>
        <MDBox
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <FormikInput
            name={"description"}
            label={"Descripción"}
            errors={formikExpense.errors}
            sx={{ flex: 1 }}
          />
          <FormikInput
            name={"sender_amount.amount"}
            label={"Monto Remitente"}
            type="number"
            errors={formikExpense.errors}
          />

          <FormikInput
            name={"recipient_amount.amount"}
            label={"Monto Destinatario"}
            type="number"
            errors={formikExpense.errors}
          />
        </MDBox>
        <MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={2} pt={2}>
          <MDButton
            // ref={}
            variant="contained"
            color="primary"
            // loading={loading}
            // disabled={loading}
            onClick={() => formikExpense.handleSubmit()}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Guardar
          </MDButton>
          <MDButton
            // ref={signInButtonRef}
            variant="outlined"
            color="primary"
            // loading={loading}
            // disabled={loading}
            onClick={handleExpenseDismiss}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Cancelar
          </MDButton>
        </MDBox>
      </FormikProvider>
    </Modal>
  )
}

export default NewExpenseModal
