import MDTypography from "../../../../../components/MDUI/MDTypography"
import { ErrorMessage } from 'formik';
import MDBox from "../../../../../components/MDUI/MDBox"
import FormikInput from "../../../../../components/FormInputs/FormikInput"
import MDButton from "../../../../../components/MDUI/MDButton"
import React, { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, InputAdornment, Radio, RadioGroup } from "@mui/material"
import { useApi } from "../../../../../utils/helpers"
import { useNavigate, useParams } from "react-router-dom"
import { DTA_STEPS } from "./data"


const DTAGeneralInformation = ({
   values,
   setFieldValue,
   step,
   setStep,
   isValid,
   cities,
   getCountryCities,
   clients,
   getClients
}) => {
  const api = useApi()
  const [hasSubstituteTruck, setHasSubstituteTruck] = useState(false)
  const [trucks, setTrucks] = useState(false)
  const [trailers, setTrailers] = useState(false)
  const [crts, setCrts] = useState(false)

  const getCRTs = (search) => {
    api.getCRTs({search}).handle({
      onSuccess: (result) => {
        const {data} = result
        setCrts(data?.results)
      },
      errorMessage: "Error al tratar de listar los CRTs",
    })
  }

  const getTrucks = (search) => {
    api.getTrucks({search}).handle({
      onSuccess: (result) => {
        const {data} = result
        setTrucks(data?.results)
      },
      errorMessage: "Error al tratar de listar clientes",
    })
  }

  const getTrailers = (search) => {
    api.getTrailers({search}).handle({
      onSuccess: (result) => {
        const {data} = result
        setTrailers(data?.results)
      },
      errorMessage: "Error al tratar de listar clientes",
    })
  }

  useEffect(() => {
    getTrucks('')
    getTrailers('')
    getCRTs('')
  }, [])

  // useEffect(() => {
  //   console.log(hasSubstituteTruck)
  // }, [hasSubstituteTruck])


  return (
    <>
      <MDTypography>
        Información General del DTA
      </MDTypography>
      {/*<FormikProvider value={formik}>*/}
        <MDBox p={5} borderRadius={"2%"}>
          <FormikInput
            name={"DTA_number"}
            label={"Nro. CRT"}
            accessKey={"crt_number"}
            type={"autocomplete"}
            options={crts}
            errors={ErrorMessage}
          />
          <FormikInput
            name={"extra_1"}
            label={"Extra 1"}
            errors={ErrorMessage}
            // disabled={loading}
          />
          <FormikInput
            name={"extra_2"}
            label={"Extra 2"}
            errors={ErrorMessage}
            // disabled={loading}
          />
          <MDBox display={"flex"}>
            {/*<FormikInput*/}
            {/*  name={"carrier_rol_del_contribuyente"}*/}
            {/*  label={"Rol del Contribuyente"}*/}
            {/*  errors={ErrorMessage}*/}
            {/*  sx={{ flex: "1 0px", pr: 1 }}*/}
            {/*  // disabled={loading}*/}
            {/*/>*/}

            <MDBox sx={{ flex: "1 0px",}}>
              <MDTypography color="primary" fontSize={"14px"}>
                2 - Transito Aduanero
              </MDTypography>
              <RadioGroup
                defaultValue={false}
                row
                name="transito_aduanero"
                onClick={(e) => {
                  setFieldValue("transito_aduanero", e.target.value);
                }}
              >
                <FormControlLabel value={true} control={<Radio />} label={"Sí"} />
                <FormControlLabel value={false} control={<Radio />} label={"No"} />
              </RadioGroup>
            </MDBox>
          </MDBox>
          <MDBox display={"flex"}>
            <FormikInput
              name={"MIC_DTA_number"}
              label={"4 - MIC/DTA"}
              errors={ErrorMessage}
              sx={{ flex: "1 0px", pr: 1 }}
              // disabled={loading}
            />
            <FormikInput
              name={"issue_date"}
              label={"6 - Fecha de emisión"}
              type={"date"}
              errors={ErrorMessage}
              setFieldValue={setFieldValue}
              sx={{ flex: "1 0px" }}
              // disabled={loading}
            />
          </MDBox>
          <FormikInput
            name={"departure_customs"}
            label={"7 - Aduana Ciudad y País de Partida"}
            type={"autocomplete"}
            values={values.departure_customs}
            options={cities}
            onInputChange={(value) => getCountryCities(value)}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={"destination_city"}
            label={"8 - Ciudad y País Destino"}
            type={"autocomplete"}
            values={values.destination_city}
            options={cities}
            onInputChange={(value) => getCountryCities(value)}
            errors={ErrorMessage}
            disabled={true}
          />
          <FormikInput
            name={"truck"}
            accessKey={"company_truck_name"}
            label={"9 - Tractocamión"}
            type={"autocomplete"}
            values={values.truck}
            options={trucks}
            onInputChange={(value) => getTrucks(value)}
            errors={ErrorMessage}
            // disabled={loading}
          />
          <MDBox display={"flex"} sx={{ flexWrap: "wrap" }}>
            <FormikInput
              name={"name"}
              label={"10 - Rol Contribuyente"}
              errors={ErrorMessage}
              sx={{ width: "50%", pr: 1 }}
              disabled={true}
            />
            <FormikInput
              name={"trailer"}
              accessKey={"chassis"}
              label={"15??? - Semi Remolque"}
              type={"autocomplete"}
              values={values.trailer}
              options={trailers}
              onInputChange={(value) => getTrailers(value)}
              errors={ErrorMessage}
              sx={{ width: "50%" }}
              // disabled={loading}
            />
            <FormikInput
              name={"truck.plate"}
              label={"11 - Placa del Camión"}
              errors={ErrorMessage}
              sx={{ width: "25%", pr: 1 }}
              // values={values.truck?.plate}
              disabled={true}
            />
            <FormikInput
              name={"truck.brand"}
              label={"12 - Marca y Número"}
              errors={ErrorMessage}
              sx={{ width: "25%", pr: 1 }}
              disabled={true}
            />
            <FormikInput
              name={"truck.load_capacity"}
              label={"13 - Capacidad de Arrastre"}
              errors={ErrorMessage}
              sx={{ width: "25%", pr: 1 }}
              disabled={true}
            />
            <FormikInput
              name={"truck.year"}
              label={"14 - Año"}
              type={"number"}
              errors={ErrorMessage}
              sx={{ width: "25%" }}
              disabled={true}            />
          </MDBox>
          {!hasSubstituteTruck && (
            <MDBox display={"flex"} justifyContent={"flex-end"}>
              <MDButton
                onClick={() => {
                  setFieldValue("hasSubstituteTruck", true)
                  setHasSubstituteTruck(true)
                }}
                color={"primary"}
              >
                Agregar Camión Sustituto
              </MDButton>
            </MDBox>
          )}
        </MDBox>
        {hasSubstituteTruck && (
          <MDBox p={2} borderRadius={"2%"}>
            <MDBox display={"flex"} justifyContent={"flex-end"} my={1} pb={1}>
              <CloseIcon sx={{cursor: "pointer"}} onClick={()=>{
                setHasSubstituteTruck(false)
                setFieldValue("hasSubstituteTruck", false)
              }}/>
            </MDBox>
            <FormikInput
              name={"substitute_truck"}
              accessKey={"company_truck_name"}
              label={"16 - Tractocamión"}
              type={"autocomplete"}
              options={trucks}
              errors={ErrorMessage}
              // disabled={loading}
            />
            <MDBox display={"flex"} sx={{ flexWrap: "wrap" }}>
              <FormikInput
                name={"camion_sustituto_rol_contribuyente"}
                label={"17 - Rol Contribuyente"}
                errors={ErrorMessage}
                sx={{ width: "50%", pr: 1 }}
                disabled={true}
              />
              <FormikInput
                name={"substitute_trailer"}
                accessKey={"chassis"}
                label={"22 - Semi Remolque"}
                type={"autocomplete"}
                options={trailers}
                errors={ErrorMessage}
                sx={{ width: "50%" }}
                // disabled={loading}
              />
              <FormikInput
                name={"camion_sustituto_placa_camion"}
                label={"18 - Placa del Camión"}
                errors={ErrorMessage}
                sx={{ width: "25%", pr: 1 }}
                disabled={true}
              />
              <FormikInput
                name={"camion_sustituto_marca_numero"}
                label={"19 -Marca y Número"}
                errors={ErrorMessage}
                sx={{ width: "25%", pr: 1 }}
                disabled={true}
              />
              <FormikInput
                name={"camion_sustituto_capacidad"}
                label={"20 - Capacidad de Arrastre"}
                type={"number"}
                errors={ErrorMessage}
                sx={{ width: "25%", pr: 1 }}
                disabled={true}
              />
              <FormikInput
                name={"camion_sustituto_anho"}
                label={"21 - Año"}
                type={"number"}
                errors={ErrorMessage}
                sx={{ width: "25%" }}
                disabled={true}
              />
            </MDBox>
          </MDBox>
        )}
        <MDBox display={"flex"} justifyContent={"flex-end"}>
          <MDButton color={"primary"} disabled={!isValid} onClick={() => setStep(step+1)}>Siguiente</MDButton>
        </MDBox>
      {/*</FormikProvider>*/}
    </>
  )

}

export default DTAGeneralInformation
