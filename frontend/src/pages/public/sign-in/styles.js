import colors from "../../../assets/theme/base/colors"
const { black, grey, primary, info } = colors
export const styles = {
  socialIcon: {
    maxWidth: "100%",
    maxHeight: "100%",
    display: "block",
    margin: "auto",
  },
  divider: {
    width: "100%",
    height: 1.5,
    backgroundColor: grey[300],
  },
  passwordText: {
    fontSize: "12px",
    color: grey[500],
    marginBottom: 12,
  },
  blackText: {
    color: black.main,
  },
  terms: {
    fontSize: "13px",
    color: grey[600],
  },
  linkColors: {
    color: info.main,
    cursor: "pointer",
    position: "relative",
    zIndex: 999,
  },
}
