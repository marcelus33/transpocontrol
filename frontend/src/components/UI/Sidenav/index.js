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

// react-router-dom components
import { NavLink, useLocation } from "react-router-dom"

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types"

// @mui material components
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import Link from "@mui/material/Link"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"

// Material Dashboard 2 PRO React examples
import SidenavCollapse from "components/UI/Sidenav/SidenavCollapse"
import SidenavList from "components/UI/Sidenav/SidenavList"
import SidenavItem from "components/UI/Sidenav/SidenavItem"

// Custom styles for the Sidenav
import SidenavRoot from "./SidenavRoot"

// Material Dashboard 2 PRO React context
import {
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  useMaterialUIController,
} from "context"

import { useLoginStore } from "utils/helpers"

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [openCollapse, setOpenCollapse] = useState(null)
  const [openNestedCollapse, setOpenNestedCollapse] = useState(null)
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller
  const location = useLocation()
  const { pathname } = location
  const collapseName = pathname.split("/").slice(1)[0]
  const items = pathname.split("/").slice(1)
  const subMenu = items[1]
  const baseCollapseKey = "/" + items[0]
  const loginStore = useLoginStore()

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200)
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav)
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav)
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
     */
    window.addEventListener("resize", handleMiniSidenav)

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav)
  }, [dispatch, location])

  // Render all the nested collapse items from the routes.js
  const renderNestedCollapse = (collapse) => {
    const template = collapse.map(({ name, route, key, href }) =>
      href ? (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{ textDecoration: "none" }}
        >
          <SidenavItem name={name} nested />
        </Link>
      ) : (
        <NavLink to={route} key={key} sx={{ textDecoration: "none" }}>
          <SidenavItem name={name} active={route === pathname} nested />
        </NavLink>
      )
    )

    return template
  }
  // Render the all the collapses from the routes.js
  const renderCollapse = (collapses) =>
    collapses.map(({ name, collapse, route, href, key }) => {
      let returnValue

      if (collapse) {
        returnValue = (
          <SidenavItem
            key={key}
            color={"secondary"}
            name={name}
            active={key === subMenu ? "isParent" : false}
            open={openNestedCollapse === key}
            onClick={({ currentTarget }) =>
              openNestedCollapse === key && currentTarget.classList.contains("MuiListItem-root")
                ? setOpenNestedCollapse(false)
                : setOpenNestedCollapse(key)
            }
          >
            {renderNestedCollapse(collapse)}
          </SidenavItem>
        )
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavItem color={color} name={name} active={location.pathname.includes(key)} />
          </Link>
        ) : (
          <NavLink to={route} key={key} sx={{ textDecoration: "primary" }}>
            <SidenavItem color={"primary"} name={name} active={location.pathname.includes(key)} />
          </NavLink>
        )
      }
      return <SidenavList key={key}>{returnValue}</SidenavList>
    })

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
      let returnValue

      if (type === "collapse") {
        if (href) {
          returnValue = (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              {/* < */}
            </Link>
          )
        } else if (noCollapse && route) {
          returnValue = (
            <NavLink to={route} key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                noCollapse={noCollapse}
                active={key === collapseName}
              >
                {collapse ? renderCollapse(collapse) : null}
              </SidenavCollapse>
            </NavLink>
          )
        } else {
          returnValue = (
            <SidenavCollapse
              key={key}
              name={name}
              icon={icon}
              active={collapseName === key}
              open={openCollapse === key || baseCollapseKey === key}
              onClick={() => (openCollapse === key ? setOpenCollapse(null) : setOpenCollapse(key))}
            >
              {collapse ? renderCollapse(collapse) : null}
            </SidenavCollapse>
          )
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={"secondary"}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        )
      } else if (type === "divider") {
        returnValue = <Divider key={key} light={false} />
      }

      return returnValue
    }
  )

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <List sx={{ paddingTop: 2 }}>{renderRoutes}</List>
    </SidenavRoot>
  )
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
}

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Sidenav
