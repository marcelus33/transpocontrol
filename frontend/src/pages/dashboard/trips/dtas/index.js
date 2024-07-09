import useCRUD from "../../../../hooks/useCRUD"
import { dataTableModel } from "./data"
import MDBox from "../../../../components/MDUI/MDBox"
import MDInput from "../../../../components/MDUI/MDInput"
import SearchIcon from "@mui/icons-material/Search"
import colors from "../../../../assets/theme/base/colors"
import MDButton from "../../../../components/MDUI/MDButton"
import ROUTES from "../../../../routes/routes"
import DataTable from "../../../../components/MDUI/DataTable"
import AdminLayout from "../../../../components/Layout/AdminLayout"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ConfirmModal from "../../../../components/MDUI/ConfirmModal/ConfirmModal"
import NewEditModal from "../../../../components/management/manage-users/NewEditModal"
import DTASignModal from "./details/DTASignModal"
import PageToolbar from "../../../../components/PageToolbar"

const DTAListPage = () => {
  const navigate = useNavigate()
  const [selectedDTA, setSelectedDTA] = useState(null)
  const [openDTAModal, setOpenDTAModal] = useState(false)
  const [openDeleteDTAModal, setOpenDeleteDTAModal] = useState(false)

  const pageConfig = {
    pageName: "MIC/DTA",
    getTableData: dataTableModel,
    getApi: "getDTAs",
    editApi: "editDTA",
    deleteApi: "deleteDTA",
    tableDataParams: null,
  }

  const updatedPageConfig = {
    ...pageConfig,
    tableDataParams: {

    },
  }

  const {
    deleteItemModalOpen,
    selectedItem,
    loading,
    itemsList,
    searchedTerm,
    dismissDeleteItem,
    confirmDeleteItem,
    newEditItemModalOpen,
    handleChange,
    handleSearch,
    data,
  } = useCRUD(updatedPageConfig)

  useEffect(() => {
    if (newEditItemModalOpen) navigate(ROUTES.EDIT_DTA(selectedItem.id))
  }, [newEditItemModalOpen])


  return (
    <AdminLayout title={"MIC/DTAs"}>
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={() => navigate(ROUTES.NEW_DTA)}
        pageName={"MIC/DTA"}
      />

      <DataTable
        table={data}
        showSideBorder={true}
        loading={loading}
        entriesCount={itemsList?.entries_count}
        pageSize={itemsList?.page_size}
        currentPage={itemsList?.page}
        onPageChange={handleChange}
      />

      <ConfirmModal
        open={deleteItemModalOpen}
        handleConfirm={confirmDeleteItem}
        handleClose={dismissDeleteItem}
        title={"Borrar MIC/DTA?"}
        subtitle={`Borrar el MIC/DTA ${selectedItem?.DTA_number}?`}
      />

    </AdminLayout>
  )
}

export default DTAListPage