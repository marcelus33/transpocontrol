import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"

export default styled(TextField)(({ theme, ownerState }) => {
  const { palette, functions } = theme
  const { error, success, disabled } = ownerState

  const { grey, transparent, error: colorError, success: colorSuccess, primary } = palette
  const { pxToRem } = functions

  const focusedStyles = () => ({
    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: primary.main + "!important",
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: primary.main,
    },
  })

  // styles for the input with error={true}
  const errorStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23F44335' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23F44335' stroke='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `99% ${pxToRem(14)}`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorError.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorError.main,
    },
    marginBottom: 0,
  })

  // styles for the input with success={true}
  const successStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%234CAF50' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `99% ${pxToRem(14)}`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,

    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorSuccess.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorSuccess.main,
    },
  })

  // styles for the input with disabled={true}
  const disabledStyles = () => ({
    color: grey[600],
    pointerEvents: "none",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: grey[400],
    },
    "& .MuiInputBase-input": {
      color: grey[600],
    },
    "& .MuiInputLabel-root": {
      color: grey[600],
    },
  })

  return {
    backgroundColor: transparent.main,
    marginBottom: 18,
    ...focusedStyles(),
    ...(error && errorStyles()),
    ...(success && successStyles()),
    ...(disabled && disabledStyles()),
  }
})
