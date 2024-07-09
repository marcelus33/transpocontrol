import AdminLayout from "components/Layout/AdminLayout"
import useCRUD from "../../../../hooks/useCRUD"
import getDataTableData from "./data"
import DataTable from "../../../../components/MDUI/DataTable"
import NewEditViewModal from "../../../../components/invoices/supplier-invoices/NewEditViewModal"
import ConfirmModal from "../../../../components/MDUI/ConfirmModal/ConfirmModal"
import React from "react"
import PageInvoiceToolbar from "../../../../components/PageInvoiceToolbar"

const pageConfig = {
  pageName: "Facturas Proveedor",
  getApi: "getSupplierInvoices",
  getTableData: getDataTableData,
  deleteApi: "deleteSupplierInvoice",
}

const SupplierInvoices = () => {
  const {
    pageNameLowerCase,
    pageNameSentenceCase,
    newEditItemModalOpen,
    deleteItemModalOpen,
    selectedItem,
    loading,
    itemsList,
    searchedTerm,
    filterParams,
    setFilterParams,
    dismissNewEditViewItemModal,
    openNewItemModal,
    dismissDeleteItem,
    confirmDeleteItem,
    handleChange,
    handleSearch,
    data,
  } = useCRUD(pageConfig)
  return <AdminLayout title="Facturas de Proveedores">
    {/* Toolbar */}
    <PageInvoiceToolbar
      searchValue={searchedTerm}
      onSearch={handleSearch}
      onNew={openNewItemModal}
      pageName={"Facturas Proveedor"}
      loading={loading}
      filterParams={filterParams}
      setFilterParams={setFilterParams}
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
      title={`Confirmar eliminar esta factura`}
      loading={loading}
    />
  </AdminLayout>
}

export default SupplierInvoices