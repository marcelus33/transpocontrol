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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types"

// @mui material components
import Grid from "@mui/material/Grid"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

// Authentication pages components
import PageLayout from "../PageLayout"

function AuthLayout({ children }) {
  return (
    <PageLayout>
      <MDBox position="absolute" width="100%" minHeight="100vh" />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={6} lg={6} xl={4}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
  )
}

// Typechecking props for the BasicLayout
AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthLayout
