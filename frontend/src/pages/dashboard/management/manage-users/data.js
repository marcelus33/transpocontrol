import EditIcon from "@mui/icons-material/Edit"
import KeyIcon from "@mui/icons-material/Key"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import DefaultCell from "components/MDUI/DataTable/DefaultCell"
import MDButton from "components/MDUI/MDButton"
import MDBox from "components/MDUI/MDBox"

import colors from "assets/theme/base/colors"

const getDataTableData = ({ onEdit, onPasswordReset, onDelete }) => ({
  columns: [
    {
      Header: "ID",
      accessor: "id",
      width: "10%",
      Cell: ({ value }) => <DefaultCell value={value.toString() || "-"} />,
    },
    {
      Header: "Usuario",
      accessor: "email",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Nombre",
      accessor: "name",
      Cell: ({ value }) => <DefaultCell value={value || "-"} />,
    },
    {
      Header: "Perfil",
      accessor: "groups",
      Cell: ({ value }) => <DefaultCell value={value?.length ? value[0]?.name : "-"} />,
    },
    {
      Header: "Acción",
      accessor: "actions",
      width: "20%",
      Cell: ({ row }) => (
        <MDBox flex={1} display="flex" gap={2} justifyContent="space-between">
          <MDButton
            color="warning"
            variant="contained"
            onClick={() => onPasswordReset(row.original)}
          >
            <KeyIcon sx={{ color: colors.text.warning }} fontSize="large" />
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
