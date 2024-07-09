import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import DefaultCell from "../../../../components/MDUI/DataTable/DefaultCell"
import MDButton from "../../../../components/MDUI/MDButton"
import MDBox from "../../../../components/MDUI/MDBox"

import colors from "../../../../assets/theme/base/colors"
import VisibilityIcon from "@mui/icons-material/Visibility"



const dataTableModel = ({onEdit, onDelete}) => ({
  columns: [
    {
      Header: "CRT",
      accessor: "crt_number",
      Cell: ({ value }) => <DefaultCell value={value || "--"} />,
    },
    {
      Header: "Destinatario",
      accessor: "sender",
      Cell: ({ value }) => <DefaultCell value={value || "--"} />,
    },
    {
      Header: "Acción",
      accessor: "actions",
      disableOrdering: true,
      width: "20%",
      Cell: ({ row }) => (
        <MDBox flex={1} display="flex" gap={2} justifyContent="space-between">
          <MDButton color="success" variant="contained">
            <VisibilityIcon sx={{ color: colors.text.success }} fontSize="large" />
          </MDButton>
          <MDButton color="info" variant="contained" onClick={() => onEdit(row.original)}>
            <EditIcon sx={{ color: colors.text.info }} fontSize="large" />
          </MDButton>
          {/* onClick={() => onDelete(row.original)}*/}
          <MDButton color="error" variant="contained" onClick={() => onDelete(row.original)}>
            <DeleteOutlineIcon sx={{ color: colors.text.error }} fontSize="large" />
          </MDButton>
        </MDBox>
      )
    },
  ],

  rows: [],
})

export default dataTableModel
