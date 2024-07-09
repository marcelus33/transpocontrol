import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types"

// @material-ui core components
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Icon from "@mui/material/Icon"
// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

// Material Dashboard 2 PRO React examples
// Custom styles for DashboardNavbar
import { navbar } from "examples/Navbars/DashboardNavbar/styles"

// Material Dashboard 2 PRO React context
import { setMiniSidenav, setTransparentNavbar, useMaterialUIController } from "context"
import logo from "../../../../assets/images/transpocargo-logo.png"
import MDTypography from "../../../MDUI/MDTypography"
import accountIcon from "assets/icons/account.svg"
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover } from "@mui/material"
import { NotificationBell } from "../../../../assets/theme/components/SvgIcons"
import NavbarPopover from "./NavbarPopover"
import LogoutIcon from "@mui/icons-material/Logout"
import ROUTES from "routes/routes"
import { useStores } from "models"

function DashboardNavbar({ absolute, light, title }) {
  const [navbarType, setNavbarType] = useState()
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller

  const rootStore = useStores()
  const { loginStore, projectStore } = rootStore
  const userName = loginStore.name || "Usuario sin nombre"

  const navigate = useNavigate()

  // Accounts Settings Popover
  const [accountsSettingsPopoverAnchorEl, setOpenMenu] = useState(null)
  const accountsSettingsPopoverOpen = Boolean(accountsSettingsPopoverAnchorEl)
  const accountsSettingsPopoverId = accountsSettingsPopoverOpen
    ? "account-settings-popover"
    : undefined

  // Notifications Popover
  const [openBellMenu, setOpenBellMenu] = useState(null)
  const openBell = Boolean(openBellMenu)
  const bellId = openBell ? "notification-bell-popover" : undefined

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky")
    } else {
      setNavbarType("static")
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar)
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
     */
    window.addEventListener("scroll", handleTransparentNavbar)

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar()

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar)
  }, [dispatch, fixedNavbar])

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav)
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget)
  const handleCloseAccountsSettingsPopover = () => setOpenMenu(null)
  const handleOpenBellMenu = (event) => setOpenBellMenu(event.currentTarget)
  const handleCloseBellMenu = () => setOpenBellMenu(null)

  const handleSignOut = () => {
    loginStore.reset()

    // Verifica si projectStore está definido antes de llamar a reset
    if (projectStore) {
      projectStore.reset()
    }

    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <AppBar
      position={navbarType}
      color="inherit"
      sx={(theme) => ({
        ...navbar(theme, { transparentNavbar, absolute, light, darkMode }),
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Toolbar sx={{ height: "80%" }}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          sx={{ width: "100%", height: "50%", minHeight: 0 }}
        >
          <MDBox sx={{ marginLeft: "4px" }}>
            <IconButton onClick={handleMiniSidenav}>
              <Icon
                sx={({ palette: { dark, white, text }, functions: { rgba } }) => ({
                  color: () => {
                    let colorValue = light || darkMode ? white.main : dark.main

                    if (transparentNavbar && !light) {
                      colorValue = darkMode ? rgba(text.main, 0.6) : text.main
                    }
                    return colorValue
                  },
                })}
              >
                {"menu"}
              </Icon>
            </IconButton>
          </MDBox>

          <MDBox sx={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 6 }}>
            <MDBox component="img" src={logo} alt="logo" sx={{ height: "100%" }} />

            <MDTypography
              variant={"h4"}
              sx={{
                marginLeft: 4,
              }}
            >
              {title}
            </MDTypography>
          </MDBox>

          <MDBox sx={{ flex: 1, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <IconButton onClick={handleOpenBellMenu} aria-describedby={bellId}>
              <NotificationBell />
            </IconButton>

            {/* Popover Notifications */}
            <NavbarPopover
              id={bellId}
              open={openBell}
              anchorEl={openBellMenu}
              onClose={handleCloseBellMenu}
            />

            <MDTypography sx={{ paddingRight: 2, paddingTop: 0.4 }}>{userName}</MDTypography>

            <IconButton onClick={handleOpenMenu} aria-describedby={accountsSettingsPopoverId}>
              <MDBox component="img" src={accountIcon} alt="logo" sx={{ height: "36px" }} />
            </IconButton>

            <NavbarPopover
              id={accountsSettingsPopoverId}
              open={accountsSettingsPopoverOpen}
              anchorEl={accountsSettingsPopoverAnchorEl}
              onClose={handleCloseAccountsSettingsPopover}
            >
              <List>
                <ListItem onClick={handleSignOut}>
                  <ListItemButton>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cerrar sesión"
                      primaryTypographyProps={{ fontSize: "16px" }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </NavbarPopover>
          </MDBox>
        </MDBox>
      </Toolbar>
    </AppBar>
  )
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
}

export default DashboardNavbar
