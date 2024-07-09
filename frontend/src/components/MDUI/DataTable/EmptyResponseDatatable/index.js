import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

import TableCell from "@mui/material/TableCell";

export const EmptyResponseDatatable = ({ text = "No items found", colSpan = 2 }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan}>
          <p
            style={{
              display: "flex",
              height: "55vh",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
              color: "#2E2A25",
            }}
          >
            {text}
          </p>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
