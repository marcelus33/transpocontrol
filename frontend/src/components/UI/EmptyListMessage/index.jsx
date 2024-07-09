import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"
import { InfoOutlined } from "@mui/icons-material"

export default function EmptyListMessage({ children, typographyProps } = {}) {
  return (
    <MDBox sx={$container}>
      <InfoOutlined />
      <MDTypography variant="h6" {...typographyProps}>
        {children}
      </MDTypography>
    </MDBox>
  )
}

const $container = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#EDEDEE",
  height: 200,
  borderRadius: "8px",
}
