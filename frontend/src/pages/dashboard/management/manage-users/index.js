import React, { useState } from "react"

import getDataTableData from "./data"
import useCRUD from "hooks/useCRUD"

import AdminLayout from "components/Layout/AdminLayout"
import DataTable from "components/MDUI/DataTable"
import ConfirmModal from "components/MDUI/ConfirmModal/ConfirmModal"
import ResetPasswordModal from "components/management/manage-users/ResetPasswordModal"
import PageToolbar from "components/PageToolbar"
import NewEditModal from "components/management/manage-users/NewEditModal"

const pageConfig = {
  pageName: "Usuarios",
  getApi: "getUsers",
  getTableData: getDataTableData,
  deleteApi: "deleteUser",
  tableDataParams: null,
}

const ManageUsers = () => {
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)

  const openPasswordReset = (userData) => {
    setSelectedItem(userData)
    setResetPasswordModalOpen(true)
  }

  const dismissPasswordReset = () => {
    setResetPasswordModalOpen(false)
    setSelectedItem(null)
  }

  const updatedPageConfig = {
    ...pageConfig,
    tableDataParams: {
      onPasswordReset: openPasswordReset,
    },
  }

  const {
    pageNameSentenceCase,
    newEditItemModalOpen,
    deleteItemModalOpen,
    selectedItem,
    loading,
    itemsList,
    searchedTerm,
    dismissNewEditViewItemModal,
    openNewItemModal,
    dismissDeleteItem,
    confirmDeleteItem,
    handleChange,
    handleSearch,
    data,
    setSelectedItem,
  } = useCRUD(updatedPageConfig)

  return (
    <AdminLayout title={`Administración de ${pageNameSentenceCase}`}>
      {/* Toolbar */}
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={openNewItemModal}
        pageName={"Usuario"}
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

      <NewEditModal
        open={newEditItemModalOpen}
        onDismiss={dismissNewEditViewItemModal}
        selectedItem={selectedItem}
      />
      <ResetPasswordModal
        open={resetPasswordModalOpen}
        onDismiss={dismissPasswordReset}
        initialValues={selectedItem}
      />
      <ConfirmModal
        open={deleteItemModalOpen}
        handleClose={dismissDeleteItem}
        handleConfirm={confirmDeleteItem}
        title={`Confirmar eliminar este usuario`}
        loading={loading}
      />
    </AdminLayout>
  )
}

export default ManageUsers
