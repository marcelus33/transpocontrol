import React from "react"
import SearchIcon from "@mui/icons-material/Search"

import colors from "assets/theme/base/colors"

import MDBox from "components/MDUI/MDBox"
import MDButton from "components/MDUI/MDButton"
import MDInput from "components/MDUI/MDInput"

const PageToolbar = ({ searchValue, onSearch, onNew, pageName, newItemButtonLabel }) => {
  return (
    <MDBox display="flex" justifyContent="space-between" flexDirection="row">
      <MDInput
        label="Buscar"
        variant="outlined"
        inputProps={{
          endAdornment: <SearchIcon sx={{ color: colors.text.main }} />,
        }}
        sx={{
          width: "30vw",
          minWidth: "200px",
        }}
        value={searchValue}
        onChange={onSearch}
      />

      <MDButton variant="contained" color={"primary"} onClick={onNew} sx={{ height: "100%" }}>
        {newItemButtonLabel || `Nuevo ${pageName}`}
      </MDButton>
    </MDBox>
  )
}

export default PageToolbar
