
import MDBox from "../../../../components/MDUI/MDBox"
import MDButton from "../../../../components/MDUI/MDButton"
import EditIcon from "@mui/icons-material/Edit"
import colors from "../../../../assets/theme/base/colors"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import DefaultCell from "../../../../components/MDUI/DataTable/DefaultCell"
import { ViewItemIcon } from "../../../../assets/theme/components/SvgIcons"

export const dataTableModel = ({onEdit, onDelete}) => ({
  columns: [
    {Header: "MIC/DTA", accessor: "DTA_number", Cell: ({ value }) => <DefaultCell value={value || "--"} />, },
    {Header: "Cliente", accessor: "shipment_details[0].sender.name", Cell: ({ value }) => <DefaultCell value={value || "--"} />, },
    {Header: "Destinatario", accessor: "shipment_details[0].recipient.name", Cell: ({ value }) => <DefaultCell value={value || "--"} />, },
    {Header: "Patente", accessor: "shipment_details[0].consignee.name", Cell: ({ value }) => <DefaultCell value={value || "--"} />, },
    {Header: "Chofer", accessor: "shipment_details[0].driver_1.name", Cell: ({ value }) => <DefaultCell value={value || "--"} />, },
    {
      Header: "Acción",
      accessor: "actions",
      disableOrdering: true,
      width: "20%",
      Cell: ({ row }) => (
        <MDBox flex={1} display="flex" gap={2} justifyContent="space-between">
          <MDButton color="success" variant="contained">
            <ViewItemIcon sx={{ color: colors.text.success }} fontSize="large" />
          </MDButton>
          <MDButton color="info" variant="contained" onClick={() => onEdit(row.original)}>
            <EditIcon sx={{ color: colors.text.info }} fontSize="large" />
          </MDButton>
          <MDButton color="error" variant="contained" onClick={() => onDelete(row.original)}>
            <DeleteOutlineIcon sx={{ color: colors.text.error }} fontSize="large" />
          </MDButton>
        </MDBox>
      )
    }
  ],
  rows: [],
});
