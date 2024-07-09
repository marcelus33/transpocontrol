import React from "react"
import { Popover } from "@mui/material"

const NavbarPopover = ({ id, open, anchorEl, onClose, children }) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: ({ palette: { background } }) => ({
          backgroundColor: background.paper,
        }),
      }}
    >
      {children}
    </Popover>
  )
}

export default NavbarPopover
