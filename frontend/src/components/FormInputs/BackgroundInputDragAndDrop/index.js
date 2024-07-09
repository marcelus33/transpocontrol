//MUI Components
import { Icon } from "@mui/material"

// Components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"

// Styles
import { Container, InputLabel, MainContainer, Text } from "./styles"
import { useField } from "formik"
import Box from "@mui/material/Box"

function BackgroundInputDragAndDrop(props) {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ""
  const {
    htmlFor,
    fileType,
    label,
    errors,
    picture,
    height,
    width,
    containerHeight,
    containerWidth,
    mainContainerHeight,
  } = props

  const containerStyle = containerHeight
    ? { ...Container, height: containerHeight, width: containerWidth }
    : Container

  const mainContainerStyle = mainContainerHeight
    ? { ...MainContainer, height: mainContainerHeight }
    : MainContainer

  return (
    <>
      <label htmlFor={htmlFor}>
        <MDBox
          sx={errorText ? { ...containerStyle, border: "2px dashed #F44335" } : containerStyle}
        >
          {picture ? (
            <Box
              component={"img"}
              src={picture}
              alt={"Background"}
              borderRadius={5}
              width={width || "100%"}
              height={height || 150}
              sx={{ mx: "auto", objectFit: "cover" }}
            />
          ) : (
            <MDBox sx={mainContainerStyle}>
              {/*<MDTypography variant='button' sx={errorText ? {...InputLabel, color: '#F44335'} : InputLabel}>{label}</MDTypography>*/}
              <Icon color="dark" sx={{ transform: "scale(1.3)" }} mb={2}>
                camera_alt
              </Icon>
              <MDTypography variant="button" sx={Text}>
                {label}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </label>
      <MDTypography variant="subtitle2" color={"error"}>
        {errorText ? errorText : ""}
      </MDTypography>
    </>
  )
}

export default BackgroundInputDragAndDrop
