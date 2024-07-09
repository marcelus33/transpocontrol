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

import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { setLayout, setMiniSidenav, setWhiteSidenav, useMaterialUIController } from "context"

import { useStores } from "../../../models"
import { APP_CONFIG } from "../../../utils/constants"
import pageRoutes from "../../../routes/page.routes"

import DashboardNavbar from "../../UI/Navbars/DashboardNavbar"
import Sidenav from "../../UI/Sidenav"
import { Box, Container } from "@mui/material"

function AdminLayout({ title, children, requireLogin = true }) {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const isLoggedIn = loginStore.isLoggedIn

  const [controller, dispatch] = useMaterialUIController()
  const { pathname } = useLocation()
  const [onMouseEnter, setOnMouseEnter] = useState(false)

  const { miniSidenav, whiteSidenav } = controller

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false)
      setOnMouseEnter(true)
    }
  }

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true)
      setOnMouseEnter(false)
    }
  }

  useEffect(() => {
    setLayout(dispatch, "dashboard")
    setWhiteSidenav(dispatch, true)
  }, [pathname])

  const adminLayout = (
    <>
      <DashboardNavbar title={title} isMini={miniSidenav} />
      <Sidenav
        color={whiteSidenav}
        brandName={APP_CONFIG.APP_NAME}
        routes={pageRoutes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Box
        sx={({ breakpoints, transitions, functions: { pxToRem }, palette }) => ({
          position: "relative",
          height: "100vh",

          paddingTop: "80px",
          paddingBottom: 1,
          paddingRight: 1,

          backgroundColor: palette.background.default,
          display: "flex",

          [breakpoints.up("xl")]: {
            marginLeft: miniSidenav ? pxToRem(96) : pxToRem(250),
            transition: transitions.create(["margin-left", "margin-right"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
          },
        })}
      >
        <Container
          sx={({ palette }) => ({
            flex: 1,

            padding: 2,
            borderRadius: 4,

            display: "flex",
            flexDirection: "column",
            gap: 2,

            backgroundColor: palette.background.paper,

            overflowY: "scroll",
          })}
        >
          {children}
        </Container>
      </Box>
    </>
  )

  // if (!isLoggedIn && requireLogin) {
  // return <Navigate to={ROUTES.LOGIN} />
  // } else {
  return adminLayout
  // }
}

export default AdminLayout
