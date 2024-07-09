import MDBox from "../MDBox"
import MDTypography from "../MDTypography"
import Dialog from "@mui/material/Dialog"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Paper from "@mui/material/Paper"
import React from "react"
import colors from "assets/theme/base/colors"

export const Modal = ({ handleClose, open, title, maxWidth = "sm", children }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth}>
      <Paper elevation={2} sx={{ borderRadius: 0, bgcolor: colors.primary.main }}>
        <MDBox
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <MDBox flex={1} display={"flex"} sx={{}}>
            <MDTypography variant="h5" sx={{ color: colors.white.main, marginLeft: 2 }}>
              {title}
            </MDTypography>
          </MDBox>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: colors.white.main }} />
          </IconButton>
        </MDBox>
      </Paper>
      <MDBox mt={2} p={2}>
        {children}
      </MDBox>
    </Dialog>
  )
}
