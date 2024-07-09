import React, { useEffect, useState } from "react"
import MDBox from "../../../../../components/MDUI/MDBox"
import * as Yup from "yup"
import { FieldArray, FormikProvider, getIn, useFormik } from "formik"
import FormikInput from "../../../../../components/FormInputs/FormikInput"
import DataTable from "../../../../../components/MDUI/DataTable"
import getDataTableHeaders, { initialValuesCrt, validationSchemaCrt } from "./data"
import MDButton from "../../../../../components/MDUI/MDButton"
import AdminLayout from "../../../../../components/Layout/AdminLayout"
import MDTypography from "../../../../../components/MDUI/MDTypography"
import colors from "../../../../../assets/theme/base/colors"
import NewExpenseModal from "../../../../../components/trips/crts/NewExpenseModal"
import Divider from "@mui/material/Divider"
import { CURRENCIES, useApi } from "../../../../../utils/helpers"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ROUTES from "../../../../../routes/routes"
import addIcon from "../../../../../assets/icons/add.png"
import moment from "moment"
import CloseIcon from "@mui/icons-material/Close"
import { InputAdornment } from "@mui/material"

const NewCrt = () => {
  const tableHeaders = getDataTableHeaders()
  const api = useApi()
  const navigate = useNavigate()
  const {id: idCRT} = useParams();
  const [newExpenseModalOpen, setNewExpenseModalOpen] = useState(false)
  const [crtData, setCrtData] = useState(null)
  const [secondMerchantValue, setSecondMerchantValue] = useState(false)
  const [merchandiseTypes, setMerchandiseTypes] = useState([])

  const getCRT = () => {
    api.getCRT(idCRT).handle({
      onSuccess: (result) => {
        const {data} = result
        setCrtData(data)
        if (data?.type_merchandise_2)
          setSecondMerchantValue(true)
      },
      errorMessage: "Error al tratar de recuperar el CRT",
    })
  }

  const getMerchandiseValueTypes = () => {
    api.getMerchandiseValueTypes().handle({
      onSuccess: (result) => {
        const {data} = result
        setMerchandiseTypes(data)
      },
      errorMessage: "Error al tratar de recuperar el CRT",
    })
  }

  const handleSubmit = (values) => {
    if (idCRT) {
      api.updateCRT(idCRT, values).handle({
        onSuccess: () => {
          navigate(ROUTES.CRTS)
        },
        errorMessage: "Error al tratar de actualizar CRT",
      })
    } else {
      api.createCRT(values).handle({
        onSuccess: () => {
          formikCrt.resetForm()
        },
        errorMessage: "Error al tratar de crear CRT",
      })
    }
  }

  const getCRTNumber = () => {
    api.getCRTNumber().handle({
      onSuccess: (result) => {
        const {data} = result
        formikCrt.setFieldValue("crt_number", data?.next_crt_number)
      },
      errorMessage: "Error al tratar de recuperar el CRT",
    })
  }

  useEffect(() => {
    if (idCRT) getCRT()
    else getCRTNumber()
    getMerchandiseValueTypes()
  }, [])

  // useEffect(() => {
  //   console.log("Values are:", formikCrt.values)
  //   console.log("Erros are:", formikCrt.errors)
  //   console.log("isValid are:", formikCrt.isValid)
  // }, [formikCrt.values])

  const addNewExpense = (newExpense) => {
    formikCrt.setFieldValue("expenses", [...formikCrt.values.expenses, newExpense])
  }

  const calculateTotalAmount = () => {
    return formikCrt.values.expenses.reduce((total, row) => {
      return total + parseFloat(row.sender_amount.amount) + parseFloat(row.recipient_amount.amount)
    }, 0)
    // return 0
  }

  const TableCaptionComponent = () => (
    <MDBox display="flex" justifyContent={"end"} padding={2} sx={{ backgroundColor: colors.grey["200"], borderRadius: 3 }} width={"100%"}>
      <MDTypography pr={1}>Total:</MDTypography>
      <MDTypography>{calculateTotalAmount()}</MDTypography>
    </MDBox>
  )

  //  Formik
  const formikCrt = useFormik({
    initialValues: initialValuesCrt(crtData),
    validationSchema: validationSchemaCrt,
    onSubmit: (values) => {
      handleSubmit({
        ...values,
        // expenses: values.expenses.map(expense => ({...expense, amount: {...expense.amount, currency: values.currency.id}})),
        type_merchandise_1: values.type_merchandise_1?.id,
        type_merchandise_2: values.type_merchandise_2?.id || null,
        merchandise_value_2: values.addedSecondType? values.merchandise_value_2: null
      })
    },
    enableReinitialize: true,
  })

  const tableData = {
    ...tableHeaders,
    rows: formikCrt.values.expenses,
  }

  const openNewExpenseModal = () => {
    setNewExpenseModalOpen(true)
  }

  const dismissNewExpenseModal = () => {
    setNewExpenseModalOpen(false)
  }

  return (
    <AdminLayout title={"Nuevo CRT"}>
      <FormikProvider value={formikCrt}>
        {/* Start Top Left and Right */}
        <MDBox sx={{ display: "flex", paddingX: 2, paddingTop: 2 }} gap={3}>
          {/*Start Left*/}
          <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormikInput
              name={"sender"}
              label={"1 - Nombre y Domicilio del Remitente"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <FormikInput
              name={"recipient"}
              label={"4 - Nombre Destinatario"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <FormikInput
              name={"consignee"}
              label={"6 - Nombre y Domicilio del Consignatario"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <FormikInput
              name={"notify_party"}
              label={"9 - Notificar a"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <MDBox display={"flex"} gap={1}>
              <FormikInput
                name={"gross_weight_kg"}
                label={"12 - Peso Bruto"}
                type="number"
                InputProps={{ endAdornment: <InputAdornment position="end">kg.</InputAdornment> }}
                errors={formikCrt.errors}
                sx={{ flex: 1 }}
              />
              <FormikInput
                name={"net_weight_kg"}
                label={"12 - Peso Neto"}
                type="number"
                InputProps={{ endAdornment: <InputAdornment position="end">kg.</InputAdornment> }}
                errors={formikCrt.errors}
                sx={{ flex: 1 }}
              />
            </MDBox>
            <MDBox display={"flex"} gap={1}>
              <FormikInput
                name={"load_value.amount"}
                label={"14 - Moneda"}
                type="number"
                errors={formikCrt.errors}
                sx={{ flex: 1 }}
              />
              <FormikInput
                name={"volume_mcu"}
                label={"13 - Volumen"}
                type="number"
                InputProps={{ endAdornment: <InputAdornment position="end">m3</InputAdornment> }}
                errors={formikCrt.errors}
                sx={{ flex: 1 }}
              />
            </MDBox>
          </MDBox>
          {/*End Left*/}

          {/*Start Right*/}
          <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormikInput
              name={"crt_number"}
              label={"2 - Número de CRT"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
              disabled={true}
            />
            <FormikInput
              name={"carrier"}
              label={"3 - Nombre y Domicilio del Portador"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <FormikInput
              name={"place_of_issue"}
              label={"5 - Lugar y  País de Emisión"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <MDBox sx={{ flex: 1, display: "flex" }} gap={2}>
              <FormikInput
                name={"loading_place"}
                label={"7 - Lugar, País en que el portador se hace cargo de las mercancías"}
                errors={formikCrt.errors}
                sx={{ flex: 2 }}
              />
              <FormikInput
                name={"loading_date"}
                label={"7 - Fecha de carga"}
                type="date"
                setFieldValue={formikCrt.setFieldValue}
                errors={formikCrt.errors}
                sx={{ flex: 1 }}
              />
            </MDBox>
            <FormikInput
              name={"destination_place"}
              label={"8 - Lugar, País y Plazo de Entrega"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
            <FormikInput
              name={"successive_carriers"}
              label={"10 - Porteadores Sucesivos"}
              errors={formikCrt.errors}
              sx={{ flex: 1 }}
            />
          </MDBox>
          {/*End Right*/}
        </MDBox>
        {/*End Top Left and Right*/}
        <FormikInput
          name={"contains"}
          label={"11 - Cantidad y Clase de Bultos, Marcas y Números, Tipo de Mercaderías, Contenedores y accesorios"}
          type="textarea"
          rows={6}
          errors={formikCrt.errors}
          sx={{ flex: 1 }}
        />
        <MDBox display={"flex"} gap={1}>
            <FormikInput
              name={"type_merchandise_1"}
              label={"10 - Tipo de declaración de mercadería"}
              type={"autocomplete"}
              options={merchandiseTypes}
              value={formikCrt.values.type_merchandise_1?.type}
              errors={formikCrt.errors}
              sx={{ width: "25%" }}
            />
            <FormikInput
              name={"merchandise_value_1.amount"}
              label={"10 - Declaración del valor de mercadería"}
              type="number"
              errors={formikCrt.errors}
              sx={{ width: "25%"  }}
            />
          {!secondMerchantValue &&
            <MDButton
              sx={{height: "10px", width: "10px",}}
              onClick={() => {
                setSecondMerchantValue(true)
                formikCrt.setFieldValue("addedSecondType", true)
              }}
            >
              <img src={addIcon} alt="attendance" style={{ height: "10px", width: "10px", }} />
            </MDButton>
          }
          {secondMerchantValue &&
            <>
              <FormikInput
                name={"type_merchandise_2"}
                label={"10 - Tipo de declaración de mercadería"}
                type={"autocomplete"}
                options={merchandiseTypes}
                value={formikCrt.values.type_merchandise_2?.type}
                errors={formikCrt.errors}
                sx={{ width: "25%" }}
              />
              <FormikInput
                name={"merchandise_value_2.amount"}
                label={"10 - Declaración del valor de mercadería"}
                type="number"
                errors={formikCrt.errors}
                sx={{ width: "25%" }}
              />
            </>
          }
        </MDBox>
        <FormikInput
          name={"attached_documents"}
          label={"17 - Documentos Anexos"}
          type="textarea"
          rows={4}
          errors={formikCrt.errors}
          sx={{ flex: 1 }}
        />
        <MDBox display={"flex"} gap={1}>
          <FormikInput
            name={"customs_instructions"}
            label={"18 - Instrucciones sobre formalidades de aduana"}
            type="textarea"
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
          <FormikInput
            name={"remarks"}
            label={"22 - Declaraciones y Observaciones"}
            type="textarea"
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
        </MDBox>
        <MDBox display={"flex"} gap={1}>
          <FormikInput
            name={"external_freight_amount.amount"}
            label={"19 - Monto de Flete Externo"}
            type="number"
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
          <FormikInput
            name={"reimbursement_amount.amount"}
            label={"20 - Monto de Reembolso Contra Entrega"}
            type="number"
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
        </MDBox>

        <Divider/>
        {/* Start Tabla Gastos */}
        <MDBox
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 2,
          }}
          gap={2}
        >
          <MDTypography sx={{ textAlign: "center" }}>15 - Gastos</MDTypography>

          <DataTable
            table={tableData}
            entriesPerPage={false}
            showTotalEntries={false}
            showSideBorder={true}
            tableCaption={<TableCaptionComponent />}
          />

          <MDBox
            sx={{
              flex: 1,
              display: "flex",
              paddingX: 2,
              justifyContent: "flex-end",
            }}
          >
            <MDButton
              // ref={}
              variant="outlined"
              color="secondary"
              // loading={}
              // disabled={}
              onClick={() => openNewExpenseModal()}
              sx={{ borderRadius: 20, minWidth: "120px" }}
              size={"small"}
            >
              Agregar Gastos
            </MDButton>
          </MDBox>
        </MDBox>
        {/* End Tabla Gastos */}

        <MDBox sx={{ display: "flex", paddingX: 2, paddingTop: 2 }} gap={3}>
          <FormikInput
            name={"carrier_name"}
            label={"Nombre del Representante"}
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
          <FormikInput
            name={"carrier_signature"}
            label={"Firma del Representante"}
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
          <FormikInput
            name={"carrier_signature_date"}
            label={"Fecha de Firma"}
            type="date"
            setFieldValue={formikCrt.setFieldValue}
            errors={formikCrt.errors}
            sx={{ flex: 1 }}
          />
        </MDBox>

        <MDBox
          sx={{
            display: "flex",
            paddingX: 2,
            alignItems: "end",
            flexDirection: "column"
          }}
          gap={3}
        >
          {!idCRT &&
            <MDButton
              // loading={}
              variant="outlined"
              color="secondary"
              disabled={!formikCrt.isValid || !formikCrt.dirty}
              onClick={() => {
                formikCrt.handleSubmit()
                getCRTNumber()
              }}
              sx={{ borderRadius: 20, minWidth: "120px" }}
              size={"small"}
            >
              Guardar y Generar Nueva Copia
            </MDButton>
          }

          <MDButton
            // ref={}
            variant="contained"
            color="primary"
            // loading={}
            disabled={!formikCrt.isValid || !formikCrt.dirty}
            onClick={() => {
              formikCrt.handleSubmit()
              navigate(ROUTES.CRTS)
            }}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"small"}
          >
            Guardar
          </MDButton>
        </MDBox>
        <NewExpenseModal
          open={newExpenseModalOpen}
          onDismiss={dismissNewExpenseModal}
          isEditing={false}
          addNewExpense={addNewExpense}
          formik={formikCrt}
        />
      </FormikProvider>
    </AdminLayout>
  )
}

export default NewCrt
