import { useField } from "formik"
import MDInput from "../../MDUI/MDInput"
import React from "react"
import MDBox from "../../MDUI/MDBox"
import MDTypography from "../../MDUI/MDTypography"

export const FormikTextInput = (props) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const {
    variant = "outlined",
    type,
    label,
    placeholder = "",
    value,
    fullWidth = true,
    overrideError,
    multiline,
    InputProps,
    ...rest
  } = props

  return (
    <MDBox {...rest}>
      <MDInput
        type={type}
        label={label}
        placeholder={placeholder}
        multiline={multiline}
        rows={props.rows || 3}
        value={value}
        variant={variant}
        fullWidth={fullWidth}
        {...field}
        helperText={overrideError && !!errorText ? overrideError : errorText}
        error={!!errorText}
        disabled={props.disabled || false}
        InputProps={InputProps}
      />
    </MDBox>
  )
}
