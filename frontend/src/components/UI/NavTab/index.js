import * as React from "react"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import MDBox from "components/MDUI/MDBox"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <MDBox
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <MDBox sx={{ p: 3 }}>
          <MDBox>{children}</MDBox>
        </MDBox>
      )}
    </MDBox>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs({ tabs }) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <MDBox sx={{ width: "100%" }}>
      <MDBox>
        <Tabs
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          sx={{
            background: "#EEEEEE",
            borderRadius: "16px",
            fontWeight: 600,
          }}
        >
          {tabs.map((tab, key) => (
            <MDBox
              key={`${key}`}
              sx={{
                display: "flex",
                whiteSpace: "nowrap",
                minWidth: "auto",
                margin: "auto",
                justifyContent: "space-between",
              }}
              onClick={() => handleChange(null, key)}
            >
              <Tab label={tab.label} {...a11yProps(key)} sx={{ textWrap: "nowrap" }} />
            </MDBox>
          ))}
        </Tabs>
        {tabs.map((tab, key) => (
          <React.Fragment key={`${key}_content`}>
            <CustomTabPanel value={value} index={key}>
              {tab.content}
            </CustomTabPanel>
          </React.Fragment>
        ))}
      </MDBox>
    </MDBox>
  )
}
