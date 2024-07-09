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

import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { useMaterialUIController } from "context"

import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import theme from "assets/theme"
import { setupRootStore } from "./models"
import pageRoutes from "routes/page.routes"
import ROUTES from "routes/routes"

import Splash from "./pages/public/splash"
import NotFound from "./pages/public/not-found"
import SignIn from "./pages/public/sign-in"

import icon from "assets/images/transpocargo-logo.png"

import "index.css"
import ForgotPassword from "./pages/public/forgot-password"
import SetNewPassword from "./pages/public/set-new-password"
import NewCrt from "./pages/dashboard/trips/crts/new"
import DTADetails from "./pages/dashboard/trips/dtas/details/DTADetails"

export default function App() {
  const [rootStore, setRootStore] = useState(undefined)
  const [controller] = useMaterialUIController()
  const { direction } = controller

  useEffect(() => {
    ;(async () => {
      setupRootStore().then((rootStore) => {
        setRootStore(rootStore)
      })
    })()
    const favicon = document.getElementById("favicon")
    favicon?.setAttribute("href", icon)
  }, [])

  useEffect(() => {
    if (rootStore) {
      rootStore.loginStore.setUp()
    }
  }, [rootStore])

  const { pathname } = useLocation()

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction)
  }, [direction])

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
  }, [pathname])

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse)
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />
      }

      return null
    })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Protected routes */}
        {getRoutes(pageRoutes)}
        {/* END Protected routes */}

        {/* Public pages */}
        <Route path={ROUTES.ROOT} element={<Splash />} />
        <Route path={ROUTES.LOGIN} element={<SignIn />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.SET_NEW_PASSWORD} element={<SetNewPassword />} />
        <Route path={ROUTES.EDIT_CRT(':id')} element={<NewCrt />} />

        <Route path={ROUTES.NEW_DTA} element={<DTADetails />} />
        <Route path={ROUTES.EDIT_DTA(':id')} element={<DTADetails />} />
        <Route path="*" element={<NotFound />} />
        {/* END Public pages */}
      </Routes>
    </ThemeProvider>
  )
}
