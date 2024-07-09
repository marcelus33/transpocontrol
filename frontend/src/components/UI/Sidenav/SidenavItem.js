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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types"

// @mui material components
import Collapse from "@mui/material/Collapse"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Icon from "@mui/material/Icon"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

// Custom styles for the SidenavItem
import { item, itemArrow, itemContent } from "./styles/sidenavItem"

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context"
import { truncateText } from "../../../utils/helpers"
import { APP_CONFIG } from "../../../utils/constants"
import Tooltip from "@mui/material/Tooltip"
import { ListItemIcon } from "@mui/material"
import { collapseIcon, collapseIconBox } from "./styles/sidenavCollapse"

import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import RemoveIcon from "@mui/icons-material/Remove"

function SidenavItem({ color, name, active, nested, children, open, ...rest }) {
  const [controller] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller

  const iconStyles = (theme) => ({ ...collapseIcon(theme, { active }), fontSize: "10px" })

  return (
    <>
      <ListItem
        {...rest}
        component="li"
        sx={(theme) =>
          item(theme, { active, color, transparentSidenav, whiteSidenav, darkMode, miniSidenav })
        }
      >
        <MDBox
          sx={(theme) =>
            itemContent(theme, {
              active,
              miniSidenav,
              name,
              open,
              nested,
              transparentSidenav,
              whiteSidenav,
              darkMode,
            })
          }
        >
          {miniSidenav && (
            <ListItemIcon
              sx={{
                ...((theme) =>
                  collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode }),
                active),
              }}
            >
              {active ? <ArrowForwardIcon sx={iconStyles} /> : <RemoveIcon sx={iconStyles} />}
            </ListItemIcon>
          )}

          <Tooltip title={name} placement={"right"}>
            <ListItemText
              primary={truncateText(name, APP_CONFIG.MAX_SIDENAV_CHARS)}
              sx={({ palette, transitions, functions, borders }) => ({
                backgroundColor: () => {
                  let backgroundValue = palette.transparent.main

                  if (
                    (active === "isParent" && !transparentSidenav && !whiteSidenav) ||
                    (active === "isParent" && transparentSidenav && darkMode)
                  ) {
                    backgroundValue = functions.rgba(palette.white.main, 0.2)
                  } else if (active === "isParent" && transparentSidenav) {
                    backgroundValue = palette.grey[300]
                  } else if (active === "isParent" && whiteSidenav) {
                    backgroundValue = palette.grey[200]
                  } else if (miniSidenav && active) {
                    backgroundValue = functions.rgba(palette.white.main, 0.2)
                  } else if (active) {
                    backgroundValue = palette[color].main
                  }

                  return backgroundValue
                },
                transition: transitions.create("background-color", {
                  easing: transitions.easing.easeInOut,
                  duration: transitions.duration.sharp,
                }),
                "&:hover, &:focus": {
                  backgroundColor:
                    !active &&
                    functions.rgba(
                      (transparentSidenav && !darkMode) || whiteSidenav
                        ? palette.grey[400]
                        : palette.white.main,
                      0.2
                    ),
                },
                borderRadius: borders.borderRadius.md,
                paddingX: 2,
                flex: 1,
              })}
            />
          </Tooltip>
          {children && (
            <Icon
              sx={(theme) =>
                itemArrow(theme, { open, miniSidenav, transparentSidenav, whiteSidenav, darkMode })
              }
            >
              expand_less
            </Icon>
          )}
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit {...rest}>
          {children}
        </Collapse>
      )}
    </>
  )
}

// Setting default values for the props of SidenavItem
SidenavItem.defaultProps = {
  color: "info",
  active: false,
  nested: false,
  children: false,
  open: false,
}

// Typechecking props for the SidenavItem
SidenavItem.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  name: PropTypes.string.isRequired,
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  nested: PropTypes.bool,
  children: PropTypes.node,
  open: PropTypes.bool,
}

export default SidenavItem
