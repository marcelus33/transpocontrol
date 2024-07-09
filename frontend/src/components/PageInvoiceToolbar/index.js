import React, { useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import * as Yup from "yup"
import colors from "assets/theme/base/colors"

import MDBox from "components/MDUI/MDBox"
import MDButton from "components/MDUI/MDButton"
import MDInput from "components/MDUI/MDInput"
import { FormikProvider, useFormik } from "formik"
import FormikInput from "../FormInputs/FormikInput"
import Checkbox from "@mui/material/Checkbox"
import { FormControlLabel } from "@mui/material"
import { formatDate } from "../../utils/helpers"

const today = new Date()
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

const PageInvoiceToolbar = ({
                              searchValue, onSearch, onNew, pageName, newItemButtonLabel, filterParams,
                              setFilterParams, loading,
                            }) => {
  const [filterByDueDate, setFilterByDueDate] = useState(false)
  const [includeAnnulled, setIncludeAnnulled] = useState(false)
  const validationSchema = Yup.object().shape({
    date_start: Yup.date().nullable().notRequired(),
    date_end: Yup.date().nullable().notRequired(),  //.min(Yup.ref("date_start"), "End date must be after start date"),
    due_date_start: Yup.date().nullable().notRequired(),
    due_date_end: Yup.date().nullable().notRequired(),  //.min(Yup.ref("due_date_start"), "End due date must be after start due date"),
  })

  const initialValues = {
    date_start: null, //firstDayOfMonth,
    date_end: null, //lastDayOfMonth,
    due_date_start: null, //firstDayOfMonth,
    due_date_end: null, //lastDayOfMonth,
  }

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    onSubmit: (values) => handleFormSubmit(values),
    enableReinitialize: true,
  })

  const handleFormSubmit = (values) => {
    const {
      date_start,
      date_end,
      due_date_start,
      due_date_end,
    } = values
    const dateStart = date_start ? formatDate(date_start) : null
    const dateEnd = date_end ? formatDate(date_end) : null
    const dueDateStart = due_date_start ? formatDate(due_date_start) : null
    const dueDateEnd = due_date_end ? formatDate(due_date_end) : null
    let filterValues = { date_start: dateStart, date_end: dateEnd }
    if (filterByDueDate) {
      filterValues = { due_date_start: dueDateStart, due_date_end: dueDateEnd }
    }
    if (includeAnnulled) {
      filterValues = {...filterValues, is_annulled: includeAnnulled}
    }
    setFilterParams(filterValues)
  }

  const resetFilterInputs = () => {
    setFilterByDueDate(false)
    setIncludeAnnulled(false)
    formik.resetForm()
    setFilterParams({})
  }

  return (
    <MDBox display="flex" justifyContent="space-between" flexDirection="row">
      <MDBox>
        <MDInput
          label="Buscar"
          variant="outlined"
          inputProps={{
            endAdornment: <SearchIcon sx={{ color: colors.text.main }} />,
          }}
          sx={{
            width: "30vw",
            minWidth: "200px",
          }}
          value={searchValue}
          onChange={onSearch}
        />
        {/*  */}
        <MDBox display={"flex"} alignItems={"center"}>
          <MDBox display={"flex"} alignItems={"center"} gap={2} >
            <FormikProvider value={formik}>
              <MDBox>
                {!filterByDueDate && <>
                  <FormikInput
                    name={"date_start"}
                    label={"Desde"}
                    placeholder={""}
                    errors={formik.errors}
                    sx={{ flex: 1 }}
                    type="date"
                  />
                  <FormikInput
                    name={"date_end"}
                    label={"Hasta"}
                    placeholder={""}
                    errors={formik.errors}
                    sx={{ flex: 1 }}
                    type="date"
                  /></>}
                {/*  */}
                {!!filterByDueDate && <>
                  <FormikInput
                    name={"due_date_start"}
                    label={"Desde"}
                    placeholder={""}
                    errors={formik.errors}
                    sx={{ flex: 1 }}
                    type="date"
                  />
                  <FormikInput
                    name={"due_date_end"}
                    label={"Hasta"}
                    placeholder={""}
                    errors={formik.errors}
                    sx={{ flex: 1 }}
                    type="date"
                  /></>}
              </MDBox>
              {/*  */}
             <MDBox>
               <FormControlLabel
                 sx={{ marginBottom: 2 }}
                 control={
                   <Checkbox
                     checked={filterByDueDate}
                     color={"primary"}
                     onClick={() => setFilterByDueDate(!filterByDueDate)}
                   />
                 }
                 label="Por fecha de vencimiento"
               />
               <FormControlLabel
                 sx={{ marginBottom: 2 }}
                 control={
                   <Checkbox
                     checked={includeAnnulled}
                     color={"primary"}
                     onClick={() => setIncludeAnnulled(!includeAnnulled)}
                   />
                 }
                 label="Mostrar anuladas"
               />
             </MDBox>
            </FormikProvider>
          </MDBox>
          {/*  */}
          <MDBox display={"flex"} flexDirection={"column"} alignItems={"center"} gap={1} mb={1} textAlign={"center"}>
            <MDButton
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading}
              onClick={() => {
                formik.handleSubmit()
              }}
              fullWidth
            >
              Filtrar
            </MDButton>
            <MDButton
              variant="outlined"
              color="secondary"
              loading={loading}
              disabled={loading}
              onClick={resetFilterInputs}
              fullWidth
            >
              Limpiar
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
      {/**/}
      <MDButton variant="contained" color={"primary"} onClick={onNew} sx={{ height: "50px" }}>
        {newItemButtonLabel || `Nueva factura`}
      </MDButton>
    </MDBox>
  )
}

export default PageInvoiceToolbar
