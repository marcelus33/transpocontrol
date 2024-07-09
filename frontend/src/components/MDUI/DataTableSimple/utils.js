import MDTypography from "../MDTypography"
import { openInNewTab } from "utils/helpers"
import React from "react"

export const linkRender = (link) => {
  return (
    <MDTypography
      onClick={() => openInNewTab(link)}
      pt={2}
      sx={{
        textAlign: "center",
        cursor: "pointer",
        color: "#DAAD71",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: 14,
        width: 150,
        "&:hover": {
          color: "#FFF",
        },
      }}
    >
      {link}
    </MDTypography>
  )
}
