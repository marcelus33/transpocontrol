import React, { useState } from "react"
import { Field, useField, useFormikContext } from "formik"
import MDBox from "../../MDUI/MDBox"
import { AutocompleteFormik } from "../AutocompleteFormik"
import UploadDoc from "../../MDUI/MDInputUploadFile/UploadDoc"
import { FieldTypes } from "./constants"
import AutocompleteFK from "./AutocompleteFK"
import { FormikTextInput } from "./FormikTextInput"
import PropTypes from "prop-types"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import moment from "moment"
import Checkbox from "@mui/material/Checkbox"
import MDTypography from "../../MDUI/MDTypography"
import { Switch, styled } from "@mui/material"
import colors from "assets/theme/base/colors"
import { MuiTelInput } from "mui-tel-input"
import TextField from "@mui/material/TextField"

const FormikFileInput = (props) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const {
    variant = "outlined",
    label,
    fullWidth,
    name,
    picture,
    disabled,
    icon,
    containerSx,
    previewOnNewTab,
    ...rest
  } = props
  const { setFieldValue } = useFormikContext()

  return (
    <MDBox {...rest} style={{ width: "100%" }}>
      <UploadDoc
        fullWidth
        setFieldValue={setFieldValue}
        name={name}
        label={label}
        variant={variant}
        helperText={errorText}
        error={!!errorText}
        picture={picture}
        disabled={disabled}
        icon={icon}
        containerSx={containerSx}
        previewOnNewTab={previewOnNewTab}
        {...field}
      />
    </MDBox>
  )
}

const FormikBooleanInput = (props) => {
  const [field, meta] = useField(props)
  const { fullWidth, label, disabled, ...rest } = props
  return (
    <MDBox {...rest} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Checkbox {...label} {...field} disabled={disabled} />
      <MDTypography sx={{ fontSize: 12 }}>{label}</MDTypography>
    </MDBox>
  )
}

const FormikSwitchInput = (props) => {
  const [field, meta] = useField(props)
  // const errorText = meta.error && meta.touched ? meta.error : '';
  const { fullWidth, label, checked, ...rest } = props

  let labelPosition = "left"
  switch (props.labelPosition) {
    case "left":
      labelPosition = "left"
      break
    case "right":
      labelPosition = "right"
      break

    default:
      break
  }
  const labelComponent = <MDTypography sx={{ fontSize: 12 }}>{label}</MDTypography>

  return (
    <MDBox {...rest} sx={{ display: "flex", alignItems: "center", gap: 2, ...props?.sx }}>
      {labelPosition === "left" && labelComponent}
      <Switch
        {...label}
        {...field}
        checked={checked}
        // onChange={handleChange}
        // inputProps={{ "aria-label": "controlled" }}
      />
      {/* <Checkbox {...label} {...field} /> */}
      {labelPosition === "right" && labelComponent}
    </MDBox>
  )
}

const FormikPhoneInput = (props) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const { variant = "outlined", ...rest } = props
  const { setFieldValue } = useFormikContext()

  const handleChange = (_value, info) => {
    const cleanedNumber = info.nationalNumber
    let formattedPhoneNumber = `+${info.countryCallingCode}${cleanedNumber}`

    if (!info.countryCallingCode) {
      formattedPhoneNumber = `+595`
    }

    setFieldValue(field.name, formattedPhoneNumber)
  }

  return (
    <MDBox {...rest}>
      <MuiTelInput
        {...field}
        {...rest}
        defaultCountry="PY"
        value={field.value}
        onChange={handleChange}
        helperText={errorText}
        error={!!errorText}
        sx={{
          width: "100%",
        }}
      />
    </MDBox>
  )
}

const FormikDatePicker = (props) => {
  const { setFieldValue } = useFormikContext()
  const [field, meta] = useField(props)
  const errorText = meta.error ? meta.error : ""
  const { label, extraParams, containerStyle, sx, disabled } = props

  // Create a custom styled DatePicker component with the desired style override
  const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
    "& .MuiInput-root:focus": {
      borderColor: colors.primary.main,
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      "& fieldset": {
        borderColor: colors.primary.main,
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: colors.primary.main,
    },
  }))

  return (
    <MDBox {...containerStyle} sx={{ ...sx }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CustomDatePicker
          disabled={disabled}
          sx={{ width: "100%" }}
          label={label}
          value={field.value ? moment(field.value, "YYYY-MM-DD") : null}
          onChange={(value) => {
            if (value) {
              setFieldValue(field.name, value.format("YYYY-MM-DD"))
            } else {
              setFieldValue(field.name, "")
            }
          }}
          format="DD/MM/YYYY"
          renderInput={(params) => (
            <TextField
              {...params}
              helperText={meta.touched && errorText ? errorText : ""}
              error={meta.touched && Boolean(errorText)}
            />
          )}
          {...extraParams}
        />
      </LocalizationProvider>
    </MDBox>
  )
}

const FormikDateTimePicker = (props) => {
  const [field, meta] = useField(props)
  const errorText = meta.error ? meta.error : ""
  const [errorTexts, setErrorText] = useState("")
  const { setFieldValue, label, extraParams, containerStyle } = props

  return (
    <MDBox {...containerStyle}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          sx={{ width: "100%" }}
          value={moment(field.value, "YYYY-MM-DD")}
          label={label}
          format="YYYY-MM-DD"
          onChange={(value, errors) => {
            if (errors.validationError === null) {
              setFieldValue(field.name, value.format("YYYY-MM-DD"), true)
              setErrorText("")
            } else {
              setErrorText("Invalid date")
            }
          }}
          slotProps={{
            textField: {
              helperText: meta.touched ? (errorTexts ? errorTexts : errorText) : "",
              error: meta.touched && (errorText !== "" || errorTexts !== ""),
            },
          }}
          {...extraParams}
        />
      </LocalizationProvider>
    </MDBox>
  )
}

const FormikSelectInput = (props) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const {
    name,
    placeholder,
    errors,
    type = "text",
    multiple,
    freeSolo,
    value,
    label,
    fullWidth = true,
    options = [],
    setFieldValue = () => {},
    initialValue,
    onChangeSelect,
    labelFieldName = "name",
    onChange,
    ...rest
  } = props

  return (
    <Field name={name} placeholder={placeholder}>
      {({ field }) => (
        <MDBox {...rest}>
          <AutocompleteFormik
            multiple={multiple}
            freeSolo={freeSolo}
            options={options}
            labelFieldName={labelFieldName}
            field={field}
            setFieldValue={(field, value) => {
              const newValue = value !== undefined ? value : null
              setFieldValue(field, newValue)
            }}
            value={initialValue || ""}
            touched
            errors={meta.touched && errors}
            label={label}
          />
        </MDBox>
      )}
    </Field>
  )
}

const FormikInput = (props) => {
  let component = null
  switch (props.type) {
    case FieldTypes.phone:
      component = <FormikPhoneInput {...props} />
      break
    case FieldTypes.textarea:
      component = <FormikTextInput rows={props.rows} multiline {...props} />
      break
    case FieldTypes.select:
      component = <FormikSelectInput {...props} />
      break
    case FieldTypes.autocomplete:
      component = <AutocompleteFK {...props} />
      break
    case FieldTypes.date:
      component = <FormikDatePicker {...props} />
      break
    case FieldTypes.datetime:
      component = <FormikDateTimePicker {...props} />
      break
    case FieldTypes.email:
      component = <FormikTextInput {...props} />
      break
    case FieldTypes.password:
      component = <FormikTextInput {...props} />
      break
    case FieldTypes.copy:
      component = <FormikTextInput rows={props.rows} multiline {...props} />
      break
    case FieldTypes.number:
      component = <FormikTextInput {...props} />
      break
    case FieldTypes.checkbox:
      component = <FormikBooleanInput {...props} />
      break
    case FieldTypes.radio:
      component = <FormikBooleanInput {...props} />
      break
    case FieldTypes.switch:
      component = <FormikSwitchInput {...props} />
      break
    // case FieldTypes.drag_and_drop:
    //   components = <FormikTextInput {...props} />
    //   break;
    case FieldTypes.file:
      component = <FormikFileInput {...props} />
      break
    default:
      component = <FormikTextInput type={"text"} {...props} />
  }
  return component
}

FormikInput.defaultProps = {
  type: "text",
}

FormikInput.propTypes = {
  type: PropTypes.oneOf([
    "textarea",
    "phone_input",
    "password",
    "copy",
    "select",
    "autocomplete",
    "date",
    "link",
    "email",
    "drag_and_drop",
    "file",
    "text",
    "email",
    "password",
    "number",
    "checkbox",
    "datetime",
    "time",
  ]),
}

export default FormikInput
