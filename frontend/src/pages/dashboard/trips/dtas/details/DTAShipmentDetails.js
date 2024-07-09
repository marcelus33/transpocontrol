import MDTypography from "../../../../../components/MDUI/MDTypography"
import { FieldArray, ErrorMessage, getIn } from "formik"
import MDBox from "../../../../../components/MDUI/MDBox"
import FormikInput from "../../../../../components/FormInputs/FormikInput"
import MDButton from "../../../../../components/MDUI/MDButton"
import React, { useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import Divider from "@mui/material/Divider"
import { Accordion, AccordionDetails, AccordionSummary, InputAdornment } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import * as Yup from "yup"
import { DTA_EMPTY_PAGE } from "./data"
import { CURRENCIES, useApi } from "../../../../../utils/helpers"

const DTAShipmentDetails = ({
  values,
  step,
  setStep,
  isValid,
  dataOptions,
}) => {
  return (
    <>
      <MDTypography sx={{ marginBottom: 2, marginLeft: 1 }}>
        Detalles de la Carta de Porte y Envío
      </MDTypography>
      {/*<FormikProvider value={formik}>*/}
      <DTAShipmentList
        values={values}
        dataOptions={dataOptions}
      />
      <MDBox display={"flex"} justifyContent={"space-between"}>
        <MDButton color={"primary"} onClick={() => setStep(step - 1)}>
          Volver
        </MDButton>
        <MDButton color={"primary"} disabled={!isValid} onClick={() => setStep(step + 1)}>
          Siguiente
        </MDButton>
      </MDBox>
      {/*</FormikProvider>*/}
    </>
  )
}

const DTAShipmentList = ({ values, dataOptions }) => {
  const api = useApi()
  const [expanded, setExpanded] = useState(0)
  const [drivers, setDrivers] = useState(0)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const getDrivers = (search) => {
    api.getDrivers({ search }).handle({
      onSuccess: (result) => {
        const { data } = result
        setDrivers(data?.results)
      },
      errorMessage: "Error al tratar de listar clientes",
    })
  }

  useEffect(() => {
    getDrivers("")
  }, [])

  return (
    <FieldArray name={"shipment_details"}>
      {(DTAPageProps) => {
        const parentPath = DTAPageProps.name
        const valueArray = getIn(values, parentPath)
        return (
          <>
            {valueArray?.map((page, index) => (
              <DTAShipmentPageItem
                values={values}
                page={page}
                index={index}
                parentPath={parentPath}
                DTAPageProps={DTAPageProps}
                expanded={expanded}
                onChange={handleChange}
                setExpanded={setExpanded}
                dataOptions={{ ...dataOptions, drivers, getDrivers }}
              />
            ))}
          </>
        )
      }}
    </FieldArray>
  )
}

const DTAShipmentPageItem = ({
  values,
  page,
  index,
  parentPath,
  DTAPageProps,
  expanded,
  onChange,
  setExpanded,
  dataOptions,
}) => {
  const [addCompanion, setAddCompanion] = useState(false)
  const {
    cities,
    getCountryCities,
    clients,
    getClients,
    invoices,
    getInvoices,
    drivers,
    getDrivers,
  } = dataOptions

  return (
    <>
      {/*<MDBox bgColor={"#F3F5F6"} p={5} borderRadius={"2%"}>*/}
      <Accordion
        sx={{ backgroundColor: "#F3F5F6", borderRadius: "2%" }}
        expanded={expanded === index}
        onChange={onChange(index)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <MDBox display={"flex"} alignItems={"center"}>
            {index !== 0 && (
              <CloseIcon
                sx={{ cursor: "pointer", marginBottom: 2 }}
                onClick={() => DTAPageProps.remove(index)}
              />
            )}
            <MDTypography sx={{ marginBottom: 2, marginLeft: 1 }} fontWeight={"bold"}>
              {`Hoja ${index + 1}`}
            </MDTypography>
          </MDBox>
        </AccordionSummary>
        <AccordionDetails>
          <MDBox display={"flex"}>
            <FormikInput
              name={`${parentPath}.${index}.bill_of_lading`}
              label={"23 - Carta de Porte"}
              errors={ErrorMessage}
              sx={{ flex: "3 0px", pr: 1, }}
            />
            <FormikInput
              name={`${parentPath}.${index}.currency`}
              accessKey={"id"}
              label={"??? - Moneda"}
              type={"autocomplete"}
              options={CURRENCIES}
              value={page.currency}
              errors={ErrorMessage}
              sx={{
                flex: "1 0px",
              }}
              // disabled={loading}
            />
          </MDBox>

          <FormikInput
            name={`${parentPath}.${index}.destination_customs`}
            label={"24 - Aduana Destino"}
            type={"autocomplete"}
            options={cities}
            onInputChange={(value) => getCountryCities(value)}
            value={page.destination_customs}
            errors={ErrorMessage}
            // disabled={loading}
          />
          <FormikInput
            name={`${parentPath}.${index}.origin_goods`}
            label={"26 - Origen de Mercaderías"}
            type={"autocomplete"}
            options={cities}
            onInputChange={(value) => getCountryCities(value)}
            value={page.origin_goods}
            errors={ErrorMessage}
            // disabled={loading}
          />

          <MDBox display={"flex"}>
            <FormikInput
              name={`${parentPath}.${index}.FOT_value_and_currency`}
              label={"27 - Valor fob"}
              type={"number"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={`${parentPath}.${index}.freight_in_usd`}
              label={"28 - Flete"}
              type={"number"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={`${parentPath}.${index}.insurance_in_usd`}
              label={"29 - Seguro"}
              type={"number"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px" }}
              // disabled={loading}
            />
          </MDBox>
          <MDBox display={"flex"}>
            <FormikInput
              name={`${parentPath}.${index}.cargo_type`}
              label={"30 - Tipo de Bulto"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={`${parentPath}.${index}.cargo_quantity`}
              label={"31 - Cantidad de Bultos"}
              type={"number"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={`${parentPath}.${index}.gross_weight`}
              label={"32.1 - Peso Bruto"}
              type={"number"}
              InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={`${parentPath}.${index}.net_weight`}
              label={"32.2 - Peso Neto"}
              type={"number"}
              InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              errors={ErrorMessage}
              sx={{ flex: "1 0px" }}
              // disabled={loading}
            />
          </MDBox>
          {/*<FormikInput*/}
          {/*  name={`${parentPath}.${index}.contains`}*/}
          {/*  label={"Dice Contener"}*/}
          {/*  multiline={true}*/}
          {/*  rows={5}*/}
          {/*  errors={ErrorMessage}*/}
          {/*  // disabled={loading}*/}
          {/*/>*/}
          <FormikInput
            name={`${parentPath}.${index}.sender`}
            label={"33 - Remitente"}
            type={"autocomplete"}
            options={clients}
            onInputChange={(value) => getClients(value)}
            value={page.sender}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={`${parentPath}.${index}.recipient`}
            label={"34 - Destinatario"}
            type={"autocomplete"}
            options={clients}
            onInputChange={(value) => getClients(value)}
            value={page.recipient}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={`${parentPath}.${index}.consignee`}
            label={"35 - Consignatario"}
            type={"autocomplete"}
            options={clients}
            onInputChange={(value) => getClients(value)}
            value={page.consignee}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={`${parentPath}.${index}.export_invoice`}
            accessKey={"number"}
            label={"Factura de Exportación"}
            type={"autocomplete"}
            options={invoices}
            onInputChange={(value) => getInvoices(value)}
            value={page.export_invoice}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={`${parentPath}.${index}.DTA_route`}
            label={"40 - Ruta"}
            errors={ErrorMessage}
            // disabled={loading}
          />
          <MDBox display={"flex"}>
            <FormikInput
              name={`${parentPath}.${index}.driver_1`}
              label={"Chofer"}
              type={"autocomplete"}
              options={drivers}
              onInputChange={(value) => getDrivers(value)}
              value={page.driver_1}
              errors={ErrorMessage}
              sx={{
                flex: "1 0px",
                pr: 1,
              }}
            />
            <FormikInput
              name={`${parentPath}.${index}.driver_1.ruc`}
              label={"CI"}
              type={"number"}
              errors={ErrorMessage}
              sx={{
                flex: "1 0px",
              }}
              disabled={true}
            />
          </MDBox>
          {!addCompanion && (
            <>
              <MDBox display={"flex"} justifyContent={"flex-end"}>
                <MDButton onClick={() => setAddCompanion(true)}>Agregar acompañante</MDButton>
              </MDBox>
              <Divider />
              <MDBox display={"flex"} justifyContent={"flex-end"}>
                <MDButton
                  onClick={() => {
                    DTAPageProps.push({ ...DTA_EMPTY_PAGE })
                    setExpanded(index + 1)
                  }}
                >
                  Guardar y Agregar Nueva Hoja
                </MDButton>
              </MDBox>
            </>
          )}
          {addCompanion && (
            <MDBox bgColor={"#F3F5F6"} borderRadius={"2%"}>
              <Divider />
              <MDBox display={"flex"} justifyContent={"flex-end"} my={1} pb={1}>
                <CloseIcon sx={{ cursor: "pointer" }} onClick={() => setAddCompanion(false)} />
              </MDBox>
              <MDBox display={"flex"}>
                <FormikInput
                  name={"driver_2"}
                  label={"Acompañante"}
                  type={"autocomplete"}
                  options={[]}
                  errors={ErrorMessage}
                  sx={{
                    flex: "1 0px",
                    pr: 1,
                  }}
                />
                <FormikInput
                  name={"name20"}
                  label={"CI"}
                  errors={ErrorMessage}
                  sx={{
                    flex: "1 0px",
                  }}
                  // disabled={loading}
                />
              </MDBox>
              <MDBox display={"flex"} justifyContent={"flex-end"}>
                <MDButton
                  onClick={() => {
                    DTAPageProps.push({ ...DTA_EMPTY_PAGE })
                    setExpanded(index + 1)
                  }}
                >
                  Guardar y Agregar Nueva Hoja
                </MDButton>
              </MDBox>
            </MDBox>
          )}
        </AccordionDetails>
      </Accordion>
      {/*</MDBox>*/}
    </>
  )
}

export default DTAShipmentDetails
