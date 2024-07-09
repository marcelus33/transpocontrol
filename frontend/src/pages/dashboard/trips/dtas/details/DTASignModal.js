import { Modal } from "../../../../../components/MDUI/Modal"
import { ErrorMessage } from "formik"
import MDButton from "../../../../../components/MDUI/MDButton"
import React from "react"
import MDBox from "../../../../../components/MDUI/MDBox"
import FormikInput from "../../../../../components/FormInputs/FormikInput"

const DTASignModal = ({open, handleClose, handleConfirm, dtaData, isValid}) => {

  return (
    <Modal
      title={"Guardar DTA"}
      open={open}
      handleClose={handleClose}
      maxWidth="md"
    >
      {/*<FormikProvider value={formik}>*/}
        <MDBox
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <MDBox sx={{ marginBottom: "18px", flex: 1}}>
            <FormikInput
              name={"carrier_signature"}
              label={"Firma"}
              errors={ErrorMessage}
              sx={{ flex: 1 }}
            />
          </MDBox>
        </MDBox>
        <MDBox display={"flex"} justifyContent={"right"} alignItems={"center"} gap={2} pt={2}>
          <MDButton
            // ref={}
            variant="contained"
            color="primary"
            // loading={loading}
            // disabled={loading}
            onClick={handleConfirm}
            disabled={!isValid}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Guardar
          </MDButton>
          <MDButton
            // ref={signInButtonRef}
            variant="outlined"
            color="primary"
            // loading={loading}
            // disabled={loading}
            onClick={handleClose}
            sx={{ borderRadius: 20, minWidth: "120px" }}
            size={"large"}
          >
            Cancelar
          </MDButton>
        </MDBox>
      {/*</FormikProvider>*/}
    </Modal>
  )
}

export default DTASignModal