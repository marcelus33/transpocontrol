import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import DefaultCell from "components/MDUI/DataTable/DefaultCell"
import MDButton from "components/MDUI/MDButton"
import MDBox from "components/MDUI/MDBox"

import colors from "assets/theme/base/colors"
import VisibilityIcon from "@mui/icons-material/Visibility"

const getDataTableData = ({ onEdit, onView, onDelete }) => ({
  columns: [
    {
      Header: "Propietario",
      accessor: "owner",
      Cell: ({ value }) => <DefaultCell value={value?.name || "-"} />,
    },
    {
      Header: "Empresa",
      accessor: "authorized_company",
      Cell: ({ value }) => <DefaultCell value={value?.name || "-"} />,
    },
    {
      Header: "Chofer",
      accessor: "driver",
      Cell: ({ value }) => <DefaultCell value={value?.name || "-"} />,
    },
    {
      Header: "Marca",
      accessor: "brand",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Tipo",
      accessor: "type",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Año",
      accessor: "year",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Chasis",
      accessor: "chassis",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Acción",
      accessor: "actions",
      width: "20%",
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
