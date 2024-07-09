/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react"

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types"

// @mui material components
import MenuItem from "@mui/material/MenuItem"
import Link from "@mui/material/Link"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"

// custom styles for the NotificationItem
import menuItem from "./styles"

const NotificationItem = forwardRef(({ icon, title, subTitle, red, ...rest }, ref) => (
  <MenuItem {...rest} color="" ref={ref} sx={(theme) => menuItem(theme)}>
    <MDBox component={Link} py={0.5} display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="body1" color={red ? "error" : "secondary"} lineHeight={0.75}>
        {icon}
      </MDTypography>
      <MDBox display={"flex"} flexDirection={"column"}>
        <MDTypography
          variant="button"
          fontWeight="regular"
          sx={{ ml: 1, color: red ? "#e74c3c" : undefined }}
        >
          {title}
        </MDTypography>
        <MDTypography
          variant="button"
          fontWeight="regular"
          sx={{ ml: 1, color: red ? "#e74c3c" : "#909090", textWrap: "pretty" }}
        >
          {subTitle}
        </MDTypography>
      </MDBox>
    </MDBox>
  </MenuItem>
))

// Typechecking props for the NotificationItem
NotificationItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

export default NotificationItem
