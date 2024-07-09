import { Popover } from "@mui/material"
import MDBox from "../../MDUI/MDBox"
import pxToRem from "../../../assets/theme/functions/pxToRem"
import MDTypography from "../../MDUI/MDTypography"

export const PopoverItem = ({ label, onClick, ...rest }) => {
  return (
    <MDTypography
      variant="subtitle"
      fontSize={pxToRem(14)}
      style={{ cursor: "pointer" }}
      {...rest}
      onClick={onClick}
    >
      {label}
    </MDTypography>
  )
}

export const PopoverActions = ({ open, anchorEl, onClose, children, sx, horizontal }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => onClose()}
      anchorOrigin={{ vertical: "bottom", horizontal: horizontal || "right" }}
      transformOrigin={{ vertical: "top", horizontal: horizontal || "right" }}
      sx={{ ".MuiPopover-paper": { boxShadow: "none" } }}
    >
      <MDBox
        sx={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: pxToRem(18),
          minHeight: pxToRem(20),
          width: pxToRem(170),
          ...sx,
        }}
        py={pxToRem(12)}
        px={pxToRem(16)}
      >
        {children}
      </MDBox>
    </Popover>
  )
}
