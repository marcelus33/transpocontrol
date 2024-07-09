/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import { colors } from "@mui/material"

function DataTableBodyCell({ noBorder, align, showSideBorder, maxWidth, children }) {
  return (
    <MDBox
      component="td"
      py={1.5}
      paddingLeft={3}
      paddingRight={!showSideBorder && 3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        maxWidth: maxWidth,
      })}
    >
      <MDBox height="100%" width="100%" display="flex" flexDirection="row">
        <MDBox
          flex={1}
          textAlign={align}
          display="inline-block"
          width="max-content"
          color="text"
          sx={{ verticalAlign: "middle" }}
        >
          {children}
        </MDBox>
        {showSideBorder && (
          <MDBox sx={{ width: "2px", backgroundColor: colors.grey[300], marginLeft: 2 }} />
        )}
      </MDBox>
    </MDBox>
  )
}

// Setting default values for the props of DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
}

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
}

export default DataTableBodyCell
