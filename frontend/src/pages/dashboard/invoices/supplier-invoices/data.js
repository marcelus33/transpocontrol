import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import DefaultCell from "components/MDUI/DataTable/DefaultCell"
import MDButton from "components/MDUI/MDButton"
import MDBox from "components/MDUI/MDBox"

import colors from "assets/theme/base/colors"
import { formatDateForDisplay } from "utils/helpers"
import VisibilityIcon from "@mui/icons-material/Visibility"

const getDataTableData = ({ onView, onEdit, onDelete }) => ({
  columns: [
    {
      Header: "Vencimiento",
      accessor: "due_date",
      Cell: ({ value }) => <DefaultCell value={value ? formatDateForDisplay(value) : "-"} />,
    },
    {
      Header: "Proveedor",
      accessor: "supplier",
      Cell: ({ value }) => <DefaultCell value={value.name || "-"} />,
    },
    {
      Header: "Factura",
      accessor: "number",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Fecha",
      accessor: "date",
      Cell: ({ value }) => <DefaultCell value={value ? formatDateForDisplay(value) : "-"} />,
    },
    {
      Header: "IVA",
      accessor: "total_tax_amount",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Total",
      accessor: "total_amount",
      Cell: ({ value }) => <DefaultCell value={value.amount || "-"} />,
    },
    {
      Header: "Pagado",
      accessor: "paid_amount",
      Cell: ({ value }) => <DefaultCell value={value.amount || "-"} />,
    },
    {
      Header: "Adeudado",
      accessor: "outstanding_amount",
      Cell: ({ value }) => <DefaultCell value={value.amount || "-"} />,
    },
    {
      Header: "Acción",
      accessor: "actions",
      width: "10%",
      Cell: ({ row }) => (
        <MDBox flex={1} display="flex" gap={2} justifyContent="space-between">
          <MDButton color="success" variant="contained" onClick={() => onView(row.original)}>
            <VisibilityIcon sx={{ color: colors.text.success }} fontSize="large" />
          </MDButton>
          <MDButton color="info" variant="contained" onClick={() => onEdit(row.original)}>
            <EditIcon sx={{ color: colors.text.info }} fontSize="large" />
          </MDButton>
          <MDButton color="error" variant="contained" onClick={() => onDelete(row.original)}>
            <DeleteOutlineIcon sx={{ color: colors.text.error }} fontSize="large" />
          </MDButton>
        </MDBox>
      ),
    },
  ],

  rows: [],
})

export default getDataTableData
