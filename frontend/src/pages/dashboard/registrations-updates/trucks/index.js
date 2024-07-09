import React from "react"

import getDataTableData from "./data"
import useCRUD from "hooks/useCRUD"

import AdminLayout from "components/Layout/AdminLayout"
import DataTable from "components/MDUI/DataTable"
import PageToolbar from "components/PageToolbar"
import ConfirmModal from "components/MDUI/ConfirmModal/ConfirmModal"
import NewEditViewModal from "components/registrations-updates/trucks/NewEditViewModal"

const pageConfig = {
  pageName: "Tractocamiones",
  getApi: "getTrucks",
  getTableData: getDataTableData,
  deleteApi: "deleteTruck",
}

const Trucks = () => {
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
  } = useCRUD(pageConfig)

  return (
    <AdminLayout title={pageNameSentenceCase}>
      {/* Toolbar */}
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={openNewItemModal}
        newItemButtonLabel="Nuevo Tractocamión"
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
        title={`Confirmar eliminar este tractocamión`}
        loading={loading}
      />
    </AdminLayout>
  )
}

export default Trucks
