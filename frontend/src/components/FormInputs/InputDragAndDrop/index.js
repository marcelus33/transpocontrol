//MUI Components
import { Icon } from "@mui/material"

// Components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"

// Styles
import { Container, InputLabel, Text } from "./styles"
import { useField } from "formik"

function InputDragAndDrop(props) {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const { htmlFor, fileType, label, errors } = props
  return (
    <>
      <label htmlFor={htmlFor}>
        <MDBox sx={errorText ? { ...Container, border: "2px dashed #F44335" } : Container}>
          <MDTypography
            variant="button"
            sx={errorText ? { ...InputLabel, color: "#F44335" } : InputLabel}
          >
            {label}
          </MDTypography>
          <Icon color="info">{fileType !== "image" ? "feed_outlined" : "image_outlined"}</Icon>
          <MDTypography variant="button" sx={Text}>
            Drag and drop, or browse {fileType !== "image" ? "files" : "images"} here
          </MDTypography>
        </MDBox>
      </label>
      <MDTypography variant="subtitle2" color={"error"}>
        {errorText ? errorText : ""}
      </MDTypography>
    </>
  )
}

export default InputDragAndDrop
