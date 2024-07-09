import { useEffect, useState } from "react"
import moment from "moment"

// Components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"

// Assets
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useApi } from "utils/helpers"

export const NotificationsDrawer = () => {
  const api = useApi()

  const [notifications, setNotifications] = useState([])

  const getNotifications = () => {
    api.getNotifications().handle({
      onSuccess: (result) => {
        console.log(" result ===>>> ", result)
        setNotifications(result.data)
        readNotifications()
      },
      errorMessage: "Error getting notifications",
    })
  }

  const readNotifications = () => {
    api.readNotifications().handle({
      onSuccess: (result) => {
        console.log(" result ===>>> ", result)
        // setNotifications(result.data)
      },
      errorMessage: "Error getting notifications",
    })
  }

  useEffect(() => {
    getNotifications()
  }, [])

  return (
    <MDBox p={0.5}>
      <MDBox mt={1} display="flex" flexDirection="column" overflow="auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <MDBox
              key={n?.id}
              display="flex"
              flexDirection="column"
              gap={1}
              borderBottom="1px solid #DDDDDD"
              py={2}
            >
              <MDBox display="flex" alignItems="center" justifyContent="space-between">
                <MDBox display="flex" alignItems="center" gap={2}>
                  <MDTypography
                    width="150px"
                    pt={1}
                    sx={({ palette: { primary, textSideNav } }) => ({
                      fontWeight: "500",
                      fontSize: "16px",
                      lineHeight: "22px",
                      color: !n?.is_read ? primary.main : textSideNav.focus,
                    })}
                  >
                    {n?.title}
                  </MDTypography>
                </MDBox>
              </MDBox>
              <MDBox pl={1} mr={1} width={300} display="flex" flexDirection="column" gap={4}>
                <MDBox display="flex">
                  <MDTypography
                    sx={({ palette: { primary, textSideNav } }) => ({
                      fontWeight: "500",
                      fontSize: "14px",
                      color: !n?.is_read ? primary.main : textSideNav.focus,
                      lineHeight: "22px",
                    })}
                  >
                    {n?.description}
                  </MDTypography>
                </MDBox>
                <MDTypography
                  mt={-3}
                  sx={() => ({
                    fontWeight: "500",
                    fontSize: "12px",
                    color: "#909090",
                  })}
                >
                  <AccessTimeIcon sx={{ mr: 1, mb: -0.2 }} />
                  {moment(n?.timestamp).format("MM/DD/YYYY hh:mm A")}
                </MDTypography>
              </MDBox>
            </MDBox>
          ))
        ) : (
          <MDBox
            display="flex"
            flexDirection="column"
            gap={1}
            borderBottom="1px solid #DDDDDD"
            py={2}
          >
            <MDBox pl={1} mr={1} width={300} display="flex" flexDirection="column" gap={4}>
              <MDBox display="flex">
                <MDTypography
                  sx={({ palette: { primary, textSideNav } }) => ({
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#909090",
                    lineHeight: "22px",
                  })}
                >
                  You don't have notifications yet
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  )
}
