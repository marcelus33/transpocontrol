import AdminLayout from "../../../../../components/Layout/AdminLayout"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import DTAGeneralInformation from "./DTAGeneralInformation"
import DTAShipmentDetails from "./DTAShipmentDetails"
import DTASignModal from "./DTASignModal"
import { DTA_EMPTY_PAGE, DTA_STEPS, DTAValidationSchema, NEW_DTA } from "./data"
import { useApi } from "../../../../../utils/helpers"
import ROUTES from "../../../../../routes/routes"

const DTADetails = () => {
  const { dtaId } = useParams()
  // const [searchParams, setSearchParams] = useSearchParams();
  const api = useApi()
  const navigate = useNavigate()
  const { id: idDTA } = useParams()
  const [step, setStep] = useState(DTA_STEPS.GENERAL_INFORMATION)
  const [clients, setClients] = useState([])
  const [cities, setCities] = useState([])
  const [invoices, setInvoices] = useState([])
  const [dtaData, setDtaData] = useState([])

  const getDTA = () => {
    api.getDTA(idDTA).handle({
      onSuccess: (result) => {
        const { data } = result
        setDtaData(data)
      },
      errorMessage: "Error al tratar de recuperar el DTA",
    })
  }
  const getClients = (search) => {
    api.getClients({ search }).handle({
      onSuccess: (result) => {
        const { data } = result
        setClients(data?.results)
      },
      errorMessage: "Error al tratar de listar clientes",
    })
  }

  const getCountryCities = (search) => {
    api.getCountryCities({ search }).handle({
      onSuccess: (result) => {
        const { data } = result
        setCities(data?.results)
      },
      errorMessage: "Error al tratar de listar ciudades",
    })
  }

  const getInvoices = (search) => {
    api.getSupplierInvoices({ search }).handle({
      onSuccess: (result) => {
        const { data } = result
        setInvoices(data?.results)
      },
      errorMessage: "Error al tratar de listar facturas",
    })
  }

  const handleSubmit = (values) => {

    if (idDTA) {
      api.updateDTA(idDTA, values).handle({
        onSuccess: () => {
          navigate(ROUTES.DTAS)
        },
        errorMessage: "Error al tratar de actualizar DTA",
      })
    } else {
      api.createDTA(values).handle({
        onSuccess: () => {
          navigate(ROUTES.DTAS)
        },
        errorMessage: "Error al tratar de crear DTA",
      })
    }
  }

  useEffect(() => {
    getClients("")
    getCountryCities("")
    getInvoices("")
    if (idDTA) getDTA()
  }, [])

  const formik = useFormik({
    initialValues: NEW_DTA(dtaData),
    validationSchema: DTAValidationSchema(step),
    onSubmit: (values) => {
      debugger
      console.log("Form values:", { ...values })
      handleSubmit({
        ...values,
        shipment_details: values.shipment_details.map(details => ({
          ...details,
          FOT_value_and_currency: {amount: details?.FOT_value_and_currency, currency: details.currency.id}})),
      })
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    if (formik.values) {
      // console.log("Values:", formik.values)
      console.log("Errors are:", formik.errors)
    }
  }, [formik.values])

  return (
    <AdminLayout title={"MIC/DTA Nuevo"}>
      <FormikProvider value={formik}>
        {step === DTA_STEPS.GENERAL_INFORMATION && (
          <DTAGeneralInformation
            values={formik.values}
            setFieldValue={formik.setFieldValue}
            step={step}
            setStep={setStep}
            isValid={formik.isValid}
            cities={cities}
            getCountryCities={getCountryCities}
            clients={clients}
            getClients={getClients}
          />
        )}
        {step === DTA_STEPS.SHIPMENT_DETAILS && (
          <DTAShipmentDetails
            values={formik.values}
            step={step}
            setStep={setStep}
            isValid={formik.isValid}
            dataOptions={{ cities, getCountryCities, clients, getClients, invoices, getInvoices }}
          />
        )}

        <DTASignModal
          open={step === DTA_STEPS.SIGN}
          handleClose={() => setStep(step - 1)}
          handleConfirm={formik.handleSubmit}
          isValid={formik.isValid && formik.dirty}
        />
      </FormikProvider>
    </AdminLayout>
  )
}

export default DTADetails
