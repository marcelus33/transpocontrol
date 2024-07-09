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
import { Link, useNavigate } from "react-router-dom"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"
import MDButton from "components/MDUI/MDButton"

// Image
// import bgImage from "assets/images/logos/logo_white.png";
import PageLayout from "../../../components/Layout/PageLayout"

import ROUTES from "routes/routes"
import { observer } from "mobx-react"
import { showMessage, useApi } from "utils/helpers"
import { useEffect, useState } from "react"
import { useStores } from "../../../models"
import Navbar from "pages/landing/components/Navbar"
import Footer from "pages/landing/components/Footer"

function ActivateUser() {
  const api = useApi()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const getUrls = window.location.href.split("activate-user/")[1].split("/")[0].split("-_-")

  const activateAccount = () => {
    const data = {
      uidb64: getUrls[0],
      token: getUrls[1],
    }
    api
      .activateAccount(data)
      .then((result) => {
        if (result.kind === "ok") {
          setSuccess(true)
          showMessage("Account verified successfully", "success")
          setTimeout(() => {
            navigate(ROUTES.LOGIN)
          }, 2000)
        } else if (result.kind === "bad-data") {
          setError(true)
          if (result.errors.token) {
            showMessage(result.errors.token)
          } else {
            showMessage(result.errors?.errors)
          }
        } else {
          setError(true)
          showMessage()
        }
      })
      .catch((err) => {
        showMessage()
        setError(true)
      })
    // .finally(() => setTimeout(() => navigate(ROUTES.LOGIN), 4000))
  }

  useEffect(() => {
    activateAccount()
  }, [])

  return (
    <PageLayout background={"white"}>
      <Navbar />
      <MDBox p={{ md: 15 }} mt={{ xs: 12 }}>
        <MDTypography variant="h2" fontWeight="medium" mb={3}>
          {success && "Account Verified"}
          {error && "Error"}
        </MDTypography>
      </MDBox>
      <Footer />
    </PageLayout>
  )
}

export default observer(ActivateUser)
