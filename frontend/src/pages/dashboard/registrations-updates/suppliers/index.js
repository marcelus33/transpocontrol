import React from "react"
import getDataTableData from "./data"
import AdminLayout from "components/Layout/AdminLayout"
import DataTable from "components/MDUI/DataTable"
import ConfirmModal from "../../../../components/MDUI/ConfirmModal/ConfirmModal"
import useCRUD from "hooks/useCRUD"
import PageToolbar from "components/PageToolbar"
import NewEditViewModal from "components/registrations-updates/suppliers/NewEditViewModal"

const pageConfig = {
  pageName: "Proveedores",
  getApi: "getSuppliers",
  getTableData: getDataTableData,
  deleteApi: "deleteSupplier",
}

const Suppliers = () => {
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
    <AdminLayout title={"Proveedores"}>
      {/* Toolbar */}
      <PageToolbar
        searchValue={searchedTerm}
        onSearch={handleSearch}
        onNew={openNewItemModal}
        newItemButtonLabel="Nuevo Proveedor"
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
        title="Confirmar eliminar este proveedor"
        loading={loading}
      />
    </AdminLayout>
  )
}

export default Suppliers
