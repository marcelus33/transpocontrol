import React, { useEffect, useState } from "react"

import SearchIcon from "@mui/icons-material/Search"

import colors from "../../../../assets/theme/base/colors"

import AdminLayout from "../../../../components/Layout/AdminLayout"
import MDBox from "../../../../components/MDUI/MDBox"
import MDButton from "../../../../components/MDUI/MDButton"
import MDInput from "../../../../components/MDUI/MDInput"
import DataTable from "../../../../components/MDUI/DataTable"

import NewEditViewModal from "../../../../components/registrations-updates/clients/NewEditViewModal"
import { useNavigate } from "react-router-dom"
import ROUTES from "../../../../routes/routes"
import useCRUD from "../../../../hooks/useCRUD"
import PageToolbar from "../../../../components/PageToolbar"
import ConfirmModal from "../../../../components/MDUI/ConfirmModal/ConfirmModal"
import dataTableModel from "./data"

const Crts = () => {
  const navigate = useNavigate()

  const pageConfig = {
    pageName: "CRT",
    getTableData: dataTableModel,
    getApi: "getCRTs",
    editApi: "editCRT",
    deleteApi: "deleteCRT",
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
    if (newEditItemModalOpen) navigate(ROUTES.EDIT_CRT(selectedItem.id))
  }, [newEditItemModalOpen])

  return (
    <AdminLayout title={"CRTs"}>
      {/* Toolbar */}
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={() => navigate(ROUTES.NEW_CRT)}
        pageName={"CRT"}
      />
      {/* END Toolbar */}

      {/* Table */}
      <DataTable
        table={data}
        showSideBorder={true}
        loading={loading}
        entriesCount={itemsList?.entries_count}
        pageSize={itemsList?.page_size}
        currentPage={itemsList?.page}
        onPageChange={handleChange}
      />
      {/* END Table */}

      <ConfirmModal
        open={deleteItemModalOpen}
        handleConfirm={confirmDeleteItem}
        handleClose={dismissDeleteItem}
        title={"Borrar CRT?"}
        subtitle={`Borrar el CRT ${selectedItem?.crt_number}?`}
      />
    </AdminLayout>
  )
}

export default Crts
