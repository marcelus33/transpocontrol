import { useEffect, useState } from "react"
import { capitalize } from "utils/helpers"
import { useApi } from "utils/helpers"

const useCRUD = ({ deleteApi, pageName, getApi, getTableData, tableDataParams }) => {
  const [newEditItemModalOpen, setNewEditItemModalOpen] = useState(false)
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState()
  const [itemsList, setItemsList] = useState({})
  const [searchedTerm, setSearchedTerm] = useState("")
  const [filterParams, setFilterParams] = useState({})

  const api = useApi()

  const pageNameLowerCase = pageName?.toString()?.toLowerCase()
  const pageNameSentenceCase = capitalize(pageNameLowerCase)

  const dismissNewEditViewItemModal = () => {
    setNewEditItemModalOpen(false)
    setSelectedItem(null)
    getItemsList({})
  }

  const openNewItemModal = () => {
    setSelectedItem(null)
    setNewEditItemModalOpen(true)
  }

  const openEditItemModal = (itemData) => {
    setSelectedItem(itemData)
    setNewEditItemModalOpen(true)
  }

  const openViewItemModal = (itemData) => {
    setSelectedItem({ ...itemData, isViewOnly: true })
    setNewEditItemModalOpen(true)
  }

  const openDeleteItem = (itemData) => {
    setDeleteItemModalOpen(true)
    setSelectedItem(itemData)
  }

  const dismissDeleteItem = () => {
    setDeleteItemModalOpen(false)
    setSelectedItem(null)
  }

  const confirmDeleteItem = () => {
    const itemId = selectedItem?.id
    api[deleteApi](itemId).handle({
      onSuccess: () => {
        dismissDeleteItem()
        getItemsList({})
      },
      successMessage: `${pageNameSentenceCase} eliminado con éxito"`,
      errorMessage: `Ocurrió un problema al obtener la lista de ${pageNameLowerCase}`,
      onFinally: () => {
        setLoading(false)
      },
    })
  }

  const getItemsList = ({ page, search, filterParams }) => {
    const params = {
      page: page || 1,
      page_size: 10,
      search,
    ...filterParams
    }

    setLoading(true)
    api[getApi](params).handle({
      onSuccess: (result) => {
        const { response } = result
        console.log(response)
        setItemsList({
          ...params,
          page: params.page,
          entries_count: response.count,
          ...response,
        })
      },
      errorMessage: `Ocurrió un problema al obtener la lista de ${pageNameLowerCase}`,
      onFinally: () => setLoading(false),
    })
  }

  const handleChange = (event, selectedPageNumber) => {
    getItemsList({ page: selectedPageNumber })
  }

  const handleSearch = (event) => {
    setSearchedTerm(event.target.value)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getItemsList({ page: 1, search: searchedTerm, filterParams: filterParams })
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchedTerm, filterParams])

  const data = getTableData({
    onEdit: openEditItemModal,
    onView: openViewItemModal,
    onDelete: openDeleteItem,
    ...tableDataParams,
  })

  if (itemsList?.results?.length) {
    data.rows = itemsList.results
  }

  return {
    pageNameLowerCase,
    pageNameSentenceCase,
    newEditItemModalOpen,
    deleteItemModalOpen,
    selectedItem,
    setSelectedItem,
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
  }
}

export default useCRUD
