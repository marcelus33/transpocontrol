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

// @mui material components
import Drawer from "@mui/material/Drawer"
import { styled } from "@mui/material/styles"

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, transitions, breakpoints, functions } = theme
  const { transparentSidenav, miniSidenav } = ownerState

  // const sidebarWidth = 250
  const { background } = palette
  const { pxToRem } = functions

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(250),
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  })

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    transform: `translateX(${pxToRem(-320)})`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem(96),
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  })

  return {
    "& .MuiDrawer-paper": {
      border: "none",
      top: "80px",
      height: "100vh",
      borderRadius: 0,
      margin: 0,
      backgroundColor: background.default,

      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  }
})
