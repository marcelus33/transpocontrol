import pxToRem from "assets/theme/functions/pxToRem";

export const Container = {
  alignItems: "center",
  border: "2px dashed #909090",
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(10),
  justifyContent: "center",
  position: "relative",
  width: "100%",
  height: 155,
  borderRadius: 5,
cursor: "pointer",
};

export const MainContainer = {
  alignItems: "center",
  background: "#CBCBCB",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  width: "97%",
  height: 135,
  borderRadius: 5,
};

export const InputLabel = {
  background: "#fff",
  fontSize: pxToRem(12),
  fontWeight: 400,
  left: "10px",
  position: "absolute",
  px: pxToRem(4),
  top: "-10px",
};

export const Text = ({ palette: { info } }) => ({
  color: info.modal,
  fontWeight: 400,
});
