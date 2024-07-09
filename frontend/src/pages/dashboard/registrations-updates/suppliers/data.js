import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import DefaultCell from "components/MDUI/DataTable/DefaultCell"
import MDButton from "components/MDUI/MDButton"
import MDBox from "components/MDUI/MDBox"

import colors from "assets/theme/base/colors"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { truncateText } from "../../../../utils/helpers"

const getDataTableData = ({ onEdit, onView, onDelete }) => ({
  columns: [
    {
      Header: "Nombre",
      accessor: "name",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "C.I. / RUC",
      accessor: "ruc",
      maxWidth: 200,
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "Dirección",
      accessor: "address",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "email",
      accessor: "email",
      maxWidth: 200,
      Cell: ({ value }) => <DefaultCell value={truncateText(value, 20)} />,
    },
    {
      Header: "Telefono",
      accessor: "phone",
      Cell: ({ value }) => <DefaultCell value={value} />,
    },
    {
      Header: "Observación",
      accessor: "observation",
      maxWidth: 220,
      Cell: ({ value }) => <DefaultCell value={truncateText(value, 60)} />,
    },
    {
      Header: "Acción",
      accessor: "actions",
      Cell: ({ row }) => (
        <MDBox flex={1} display="flex" gap={2} justify-content="space-between">
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
      width: "20%",
    },
  ],
  rows: [],
})

export default getDataTableData
