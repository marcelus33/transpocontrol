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

// react-router-dom components
import { useNavigate } from "react-router-dom"
// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

import ROUTES from "routes/routes"
import { observer } from "mobx-react"
import { useEffect } from "react"
import { useStores } from "../../../models"
import PageLayout from "../../../components/Layout/PageLayout"
import "./styles.css"

const logo = require("assets/images/transpocargo-logo.png")

function Splash() {
  const rootStore = useStores()
  const { loginStore } = rootStore
  const navigate = useNavigate()

  useEffect(() => {
    // setTimeout(() => {
    if (loginStore.isLoggedIn) {
      navigate(ROUTES.LOGIN)
    } else {
      navigate(ROUTES.LOGIN)
    }
    // }, 3000)
  }, [])

  return (
    <PageLayout>
      <MDBox sx={{ display: "flex", flex: 1, flexGrow: 1, height: "100vh" }}>
        <MDBox
          component="img"
          src={logo}
          alt={"logo"}
          width={300}
          position="relative"
          zIndex={1}
          margin={"auto"}
          className={"fadeIn"}
          sx={{ objectFit: "cover" }}
        />
      </MDBox>
    </PageLayout>
  )
}

export default observer(Splash)
