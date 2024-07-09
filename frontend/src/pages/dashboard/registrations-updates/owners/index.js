import React from "react"

import getDataTableData from "./data"
import useCRUD from "hooks/useCRUD"

import AdminLayout from "components/Layout/AdminLayout"
import DataTable from "components/MDUI/DataTable"
import NewEditViewModal from "components/registrations-updates/owner/NewEditViewModal"
import PageToolbar from "components/PageToolbar"
import ConfirmModal from "components/MDUI/ConfirmModal/ConfirmModal"

const pageConfig = {
  pageName: "Empresas",
  getApi: "getOwners",
  getTableData: getDataTableData,
  deleteApi: "deleteOwner",
}

// TODO: Wait for backend update the add/edit api to allow the owner picture - Refactor new/edit modal with this update

const Owners = () => {
  const {
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
  } = useCRUD(pageConfig)

  return (
    <AdminLayout title={"Propietarios / Empresas"}>
      {/* Toolbar */}
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={openNewItemModal}
        newItemButtonLabel="Nueva Empresa"
      />
      {/* END Toolbar */}

      {/* Table */}
      <DataTable
        table={data}
        showSideBorder={true}
        loading={loading}
        entriesCount={itemsList?.entries_count}
        pageSize={itemsList?.page_size}
        currentPage={itemsList?.page || 1}
        onPageChange={handleChange}
      />
      {/* END Table */}

      <NewEditViewModal
        open={newEditItemModalOpen}
        onDismiss={dismissNewEditViewItemModal}
        selectedItem={selectedItem}
      />
      <ConfirmModal
        open={deleteItemModalOpen}
        handleClose={dismissDeleteItem}
        handleConfirm={confirmDeleteItem}
        title={`Confirmar eliminar esta empresa`}
        loading={loading}
      />
    </AdminLayout>
  )
}

export default Owners
