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

// Material Dashboard 2 PRO React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Material Dashboard 2 PRO React helper functions
import pxToRem from "assets/theme/functions/pxToRem";
import rgba from "assets/theme/functions/rgba";

const { size, fontWeightRegular, fontWeightBold } = typography;
const { white, black, tertiary } = colors;

const stepLabel = {
  styleOverrides: {
    label: {
      marginTop: `${pxToRem(2)} !important`,
      fontWeight: fontWeightBold,
      fontSize: size.md,
      color: "#49443D",
      textTransform: "uppercase",

      "&.Mui-active": {
        fontWeight: `${fontWeightBold} !important`,
        color: `${rgba(black.main, 0.8)} !important`,
      },

      "&.Mui-completed": {
        fontWeight: `${fontWeightBold} !important`,
        color: `${rgba(white.main, 0.8)} !important`,
      },
    },
  },
};

export default stepLabel;
