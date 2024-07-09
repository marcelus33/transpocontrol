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

// @mui material components
import Icon from "@mui/material/Icon"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context"
import colors from "assets/theme/base/colors"

function DataTableHeadCell({ width, children, sorted, align, showSideBorder, sx, ...rest }) {
  const [controller] = useMaterialUIController()
  const { darkMode } = controller

  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={3}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`, ...sx
      })}
    >
      <MDBox
        {...rest}
        position="relative"
        sx={({ typography: { size, fontWeightMedium } }) => ({
          fontSize: size.sm,
          fontWeight: fontWeightMedium,
          cursor: sorted && "pointer",
          userSelect: sorted && "none",
        })}
      >
        <MDBox height="100%" width="100%" display="flex" flexDirection="row">
          <MDBox
            textAlign={align}
            color={darkMode ? colors.text.main : colors.white.main}
            sx={({ typography: { size, fontWeightMedium } }) => ({
              fontSize: size.sm,
              fontWeight: fontWeightMedium,
              cursor: sorted && "pointer",
              userSelect: sorted && "none",
            })}
          >
            {children}
            {sorted && (
              <MDBox
                position="absolute"
                top={0}
                right={align !== "right" ? "16px" : 0}
                left={align === "right" ? "-5px" : "unset"}
                sx={({ typography: { size } }) => ({
                  fontSize: size.lg,
                })}
              >
                <MDBox
                  position="absolute"
                  top={-6}
                  color={sorted === "asce" ? "text" : "secondary"}
                  opacity={sorted === "asce" ? 1 : 0.5}
                >
                  <Icon>arrow_drop_up</Icon>
                </MDBox>
                <MDBox
                  position="absolute"
                  top={0}
                  color={sorted === "desc" ? "text" : "secondary"}
                  opacity={sorted === "desc" ? 1 : 0.5}
                >
                  <Icon>arrow_drop_down</Icon>
                </MDBox>
              </MDBox>
            )}
          </MDBox>

          {showSideBorder && <MDBox sx={{ width: "2px", backgroundColor: colors.grey[300] }} />}
        </MDBox>
      </MDBox>
    </MDBox>
  )
}

// Setting default values for the props of DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: "auto",
  sorted: "none",
  align: "left",
}

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
}

export default DataTableHeadCell
