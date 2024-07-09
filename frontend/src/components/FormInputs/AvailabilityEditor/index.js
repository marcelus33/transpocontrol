import DeleteIcon from "@mui/icons-material/Delete"
import MDButton from "components/MDUI/MDButton"
import MDInput from "components/MDUI/MDInput"
import React, { useEffect, useState } from "react"
import MDBox from "../../MDUI/MDBox"
import MDTypography from "../../MDUI/MDTypography"
import colors from "../../../assets/theme/base/colors"

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const daysOfWeekListLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const formatTime = (timeString) => {
  const parts = timeString.split(":")

  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  const seconds = parseInt(parts[2], 10)

  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12
  const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`

  return formattedTime
}

export const AvailabilityList = ({
  availabilities = [],
  handleRemoveAvailability = () => {},
  readOnly = false,
}) => {
  return (
    <MDBox style={{ display: "flex", flexDirection: "column" }}>
      {availabilities.length > 0 &&
        availabilities.map((item, index) => {
          return (
            <MDBox key={`av-item-${index}`} style={styles.listItem}>
              <MDTypography style={styles.dayLabel}>
                {daysOfWeekListLabels[item.day_of_week]}
              </MDTypography>
              <MDTypography
                style={{ textAlign: "center", fontSize: 12, flex: 1, alignItems: "center" }}
              >
                {formatTime(item.start_time)} - {formatTime(item.end_time)}
              </MDTypography>
              {!readOnly && (
                <MDBox style={{ display: "flex", alignItems: "flex-end" }}>
                  <MDButton onClick={() => handleRemoveAvailability(index)}>
                    <DeleteIcon style={{ color: colors.error.main }} />
                  </MDButton>
                </MDBox>
              )}
            </MDBox>
          )
        })}
      {availabilities.length < 1 && (
        <MDBox>
          <MDTypography
            style={{ textAlign: "center", fontSize: 12, color: colors.grey[600], padding: 10 }}
          >
            No availability added
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  )
}

export const AvailabilityEditor = ({
  availabilities = [],
  setAvailabilities,
  containerClass = {},
}) => {
  const [startHour, setStartHour] = useState("")
  const [endHour, setEndHour] = useState("")
  const [selectedAvailabilities, setSelectedAvailabilities] = useState([])

  useEffect(() => {
    // Este efecto se ejecutará cada vez que cambien los estados relevantes.
    // Aquí puedes actualizar la interfaz de usuario según sea necesario.
  }, [availabilities, startHour, endHour, selectedAvailabilities])

  const handleAddAvailability = () => {
    if (startHour && endHour && selectedAvailabilities.length > 0) {
      let newAvailabilities = selectedAvailabilities.map((dayIndex) => ({
        day_of_week: dayIndex,
        start_time: startHour,
        end_time: endHour,
      }))
      newAvailabilities = [...availabilities, ...newAvailabilities].sort(
        (a, b) => a.day_of_week - b.day_of_week
      )
      setAvailabilities(newAvailabilities)
      setStartHour("")
      setEndHour("")
      setSelectedAvailabilities([])
    } else {
      console.log(
        "No se añadió la disponibilidad debido a que los campos están vacíos o no se seleccionaron días."
      )
    }
  }

  const handleRemoveAvailability = (index) => {
    const updatedAvailabilities = [...availabilities]
    updatedAvailabilities.splice(index, 1)
    setAvailabilities(updatedAvailabilities)
  }

  return (
    <MDBox style={{ ...styles.container, ...containerClass }}>
      <MDBox style={styles.daySelectorContainer}>
        {daysOfWeek.map((day, dayIndex) => {
          const isInList = !!availabilities.find((av, avi) => av.day_of_week === dayIndex)
          const isSelected = selectedAvailabilities.includes(dayIndex)
          let dayButtonStyle = styles.dayButtonStyle
          let dayButtonTextStyle = styles.dayButtonTextStyle
          if (isInList) {
            dayButtonStyle = styles.dayButtonInListStyle
            dayButtonTextStyle = styles.dayButtonInListTextStyle
          } else if (isSelected) {
            dayButtonStyle = styles.dayButtonSelectedStyle
            dayButtonTextStyle = styles.dayButtonSelectedTextStyle
          }
          //
          return (
            <MDButton
              disabled={isInList}
              onClick={() => {
                if (isInList) return
                if (!selectedAvailabilities.includes(dayIndex)) {
                  setSelectedAvailabilities([...selectedAvailabilities, dayIndex])
                } else {
                  const index = selectedAvailabilities.indexOf(dayIndex)
                  const selectedAvailabilitiesCopy = [...selectedAvailabilities]
                  selectedAvailabilitiesCopy.splice(index, 1)
                  setSelectedAvailabilities(selectedAvailabilitiesCopy)
                }
              }}
              key={dayIndex}
              style={dayButtonStyle}
            >
              <MDTypography style={dayButtonTextStyle}>{day}</MDTypography>
            </MDButton>
          )
        })}
      </MDBox>
      <MDBox style={styles.timeInputsContainer}>
        <MDBox style={styles.timeInputContainer}>
          <MDTypography style={styles.timeInputLabel}>From</MDTypography>
          <MDInput
            type={"time"}
            variant="outlined"
            // label={"From"}
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            style={{ marginBottom: 0, flex: 1 }}
          />
        </MDBox>
        <MDBox style={styles.timeInputContainer}>
          <MDTypography style={styles.timeInputLabel}>To</MDTypography>
          <MDInput
            type={"time"}
            variant="outlined"
            // label={"To"}
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            sx={{ marginBottom: 0, flex: 1 }}
          />
        </MDBox>
      </MDBox>
      <MDButton
        style={styles.addButton}
        variant="outlined"
        color="primary"
        onClick={handleAddAvailability}
      >
        + Add to list
      </MDButton>
      {/* */}
      <AvailabilityList
        availabilities={availabilities}
        handleRemoveAvailability={handleRemoveAvailability}
      />
    </MDBox>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  addButton: {
    width: "100%",
    // borderRadius: 20
  },
  daySelectorContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "space-between",
  },
  timeInputsContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeInputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  timeInputLabel: {
    fontSize: 12,
    fontWeight: 500,
  },
  timeInput: {
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  //
  dayButtonStyle: {
    // flex:1,
    backgroundColor: "white",
    // borderWidth:1,
    // borderColor: colors.primary,
    border: `1px solid ${colors.primary.main}`,
    borderRadius: 10,
    padding: 0,
  },
  dayButtonTextStyle: {
    color: colors.primary.main,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  //
  dayButtonInListStyle: {
    // flex:1,
    backgroundColor: colors.grey[600],
    // border: "1px solid black",
    borderRadius: 10,
    padding: 0,
  },
  dayButtonInListTextStyle: {
    color: colors.white.main,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  //
  dayButtonSelectedStyle: {
    // flex:1,
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    padding: 0,
  },
  dayButtonSelectedTextStyle: {
    color: colors.white.main,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  //
  dayLabel: {
    // flex: 1,
    width: "20%",
    fontWeight: "bold",
    fontSize: 12,
  },
}
