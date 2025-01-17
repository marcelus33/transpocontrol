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

import { forwardRef } from "react"

// prop-types is a library for typechecking of props
import PropTypes from "prop-types"

// Custom styles for MDButton
import MDButtonRoot from "components/MDUI/MDButton/MDButtonRoot"

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context"
import { CircularProgress } from "@mui/material"

const MDButton = forwardRef(
  ({ loading, color, variant, size, circular, iconOnly, children, disabled, ...rest }, ref) => {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller

    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        disabled={disabled}
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly, darkMode }}
      >
        {loading ? <CircularProgress color="inherit" size={15} /> : children}
      </MDButtonRoot>
    )
  }
)

// Setting default values for the props of MDButton
MDButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
}

// Typechecking props for the MDButton
MDButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient", "standard"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "pink",
    "light",
    "dark",
    "gray",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default MDButton
