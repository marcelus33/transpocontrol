import React, { useEffect, useState } from "react"
import { Autocomplete, FormControl, TextField } from "@mui/material"
import debounce from "lodash.debounce"
import { useField, useFormikContext } from "formik"
import MDBox from "components/MDUI/MDBox"
import colors from "assets/theme/base/colors"

const AutocompleteFK = React.memo(
  ({
     name: fieldName,
     options,
     label,
     accessKey = "name",
     styleContainer,
     overrideError,
     getOptionLabel = "",
     filterOptions, // (options, state) => options // disable local filtering
     sx,
     disabled,
     onInputChange,
   }) => {
    const [field, meta] = useField({ name: fieldName })
    const errorText = meta.error && meta.touched ? meta.error : ""
    const [inputValue, setInputValue] = useState(field?.value)
    const { setFieldValue } = useFormikContext()

    useEffect(() => {
      const debouncedInput = debounce(() => onInputChange?.(inputValue), 300)
      debouncedInput()
      // Clean effect.
      return () => {
        debouncedInput.cancel()
      }
    }, [inputValue])

    return (
      <FormControl sx={{ width: "100%", ...sx }}>
        <MDBox {...styleContainer}>
          <Autocomplete
            disabled={disabled}
            accessKey={accessKey}
            size={"small"}
            clearIcon={null}
            value={field?.value}
            getOptionLabel={getOptionLabel || ((option) => option[accessKey]) || ""}
            filterOptions={filterOptions} // disable local filtering
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={(e, value) => {
              setFieldValue(fieldName, value)
            }}
            onInputChange={(event, value, reason) => {
              if (event && (event.type !== "click" || event.type !== "change")) {
                setInputValue(value)
              }
            }}
            options={options}
            noOptionsText="No se encontraron opciones"
            sx={{ width: "100%" }}
            renderInput={(params) => {
              return (
                <TextField
                  onBlur={field.onBlur}
                  name={fieldName}
                  variant="outlined"
                  helperText={overrideError && !!errorText ? overrideError : errorText}
                  error={!!errorText}
                  {...params}
                  label={label}
                  type={"text"}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: "44px",
                      marginBottom: "8px",
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: "14px",
                      "&.Mui-focused": {
                        color: colors.primary.main,
                      },
                    },
                  }}
                />
              )
            }}
          />
        </MDBox>
      </FormControl>
    )
  },
)

export default AutocompleteFK
