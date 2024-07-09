import MDBox from "../MDBox"
import MDTypography from "../MDTypography"
import MDButton from "../MDButton"
import { Modal } from "@mui/material"

function ConfirmModal({ handleClose, open, handleConfirm, title, subtitle, loading = false }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <MDBox
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          px: 4,
        }}
      >
        <MDTypography pt={2} sx={{ textAlign: "center", fontSize: "22px" }}>
          {title}
        </MDTypography>
        <MDTypography pt={2} sx={{ textAlign: "center", fontSize: "16px" }}>
          {subtitle}
        </MDTypography>
        <MDBox
          pb={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          pt={2}
        >
          <MDButton
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => {
              handleClose()
            }}
          >
            Cancelar
          </MDButton>
          <MDButton
            color={"primary-error"}
            loading={loading}
            disabled={loading}
            onClick={() => {
              handleConfirm()
            }}
          >
            Confirmar
          </MDButton>
        </MDBox>
      </MDBox>
    </Modal>
  )
}

export default ConfirmModal
