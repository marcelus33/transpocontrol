import { useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton } from "@mui/material"

import { UploadPictureIcon } from "assets/theme/components/SvgIcons"
import MDBox from "../MDBox"
import MDTypography from "../MDTypography"

const UploadDoc = ({
  error,
  success,
  disabled,
  filename,
  label,
  setFieldValue,
  name,
  picture,
  icon = null,
  containerSx = null,
  previewOnNewTab = false,
  ...rest
}) => {
  const inputID = `input_${Math.random().toString().substring(2, 15)}`
  const [file, setFile] = useState(null)

  const handleDocumentUpload = (event) => {
    if (event.target.files && event.target.files.length) {
      setFile({
        image: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      })
      setFieldValue(name, event.target.files[0])
    }
  }

  const removeFileButtonHandler = () => {
    if (!disabled) {
      setFile(null)
      setFieldValue(name, null)
    }
  }

  const openPreviewImageHandler = () => {
    if (!previewOnNewTab) return
    window.open(file?.url, "_blank")
  }

  const inputIcon = icon ? icon : <UploadPictureIcon fontSize="large" />

  let showPointer = false
  if (!!file && previewOnNewTab) {
    showPointer = true
  }
  if (!file && !disabled) {
    showPointer = true
  }
  const boxBaseStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    p: 2,
    mb: 2,
    width: "180px",
    height: "180px",
    cursor: showPointer && "pointer",
    ...containerSx,
  }

  return (
    <MDBox sx={{ display: "flex", width: "100%" }}>
      <input
        type="file"
        id={inputID}
        name={inputID}
        onChange={(e) => handleDocumentUpload(e)}
        style={{ width: 0, height: 0 }}
        disabled={disabled}
      />
      {file?.image?.name || rest?.value ? (
        <MDBox
          borderRadius={"xl"}
          sx={{
            position: "relative",
            ...boxBaseStyles,
            borderColor: "unset",
            borderStyle: "unset",
          }}
        >
          {file?.url && (
            <img
              src={file.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
              onClick={openPreviewImageHandler}
            />
          )}
          <IconButton
            aria-label="delete"
            onClick={removeFileButtonHandler}
            style={{ position: "absolute", top: 0, right: 0 }}
          >
            <DeleteIcon />
          </IconButton>
        </MDBox>
      ) : (
        <label htmlFor={inputID} style={{ display: "flex", width: "100%" }}>
          <MDBox
            borderRadius={"xl"}
            sx={{
              border: "1px solid #d2d6da",
              gap: 1,
              ...boxBaseStyles,
            }}
          >
            {inputIcon}
            <MDTypography fontWeight="bold">Subir imagen</MDTypography>
          </MDBox>
        </label>
      )}
    </MDBox>
  )
}
export default UploadDoc
