/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { useMemo, useEffect, useState } from "react"

// prop-types is a library for typechecking of props
import PropTypes from "prop-types"

// react-table components
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table"

// @mui material components
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Icon from "@mui/material/Icon"
import Autocomplete from "@mui/material/Autocomplete"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"
import MDTypography from "components/MDUI/MDTypography"
import MDInput from "components/MDUI/MDInput"
import MDPagination from "components/MDUI/MDPagination"

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "components/DataTable/DataTableHeadCell"
import DataTableBodyCell from "components/DataTable/DataTableBodyCell"
import { createSvgIcon } from "@mui/material"
import { EmptyResponseDatatable } from "../DataTable/EmptyResponseDatatable"
import Divider from "@mui/material/Divider"

// Theme functions
// import pxToRem from "assets/theme/functions/pxToRem";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
}) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"]
  // const columns = useMemo(() => table.columns, [table]);
  // const data = useMemo(() => table.rows, [table]);
  const columns = table.columns
  const data = table.rows

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance

  // Set the default value for the entries per page when components mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue])

  useEffect(() => {}, [table])

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value) => setPageSize(value)

  // Render the paginations
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ))

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value))

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option) => option + 1)

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }) => gotoPage(Number(value.value - 1))

  // Search input value state
  const [search, setSearch] = useState(globalFilter)

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 100)

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue

    if (column.hasOwnProperty("sorted")) return column?.sorted

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce"
    } else if (isSorted) {
      sortedValue = "none"
    } else {
      sortedValue = false
    }
    return sortedValue
  }

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1

  // Setting the entries ending point
  let entriesEnd

  if (pageIndex === 0) {
    entriesEnd = pageSize
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = rows.length
  } else {
    entriesEnd = pageSize * (pageIndex + 1)
  }

  return (
    <MDBox>
      <TableContainer
        sx={({ palette: { table } }) => ({
          boxShadow: "none",
          // backgroundColor: "#090909",
          borderBottom: "none",
          "& .MuiTableContainer": {
            backgroundColor: "red",
          },
        })}
      >
        <Table {...getTableProps()}>
          <MDBox
            component="thead"
            sx={({ palette: { table } }) => ({
              // backgroundColor: "#282828",
            })}
          >
            {headerGroups.map((headerGroup, index) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={`table_head-${index}`}>
                {headerGroup.headers.map((column, index2) => (
                  <DataTableHeadCell
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    key={`table_head_cell-${index2}`}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()} key={`table_row-${key}`}>
                  {table.rows.length === 0 ?? (
                    <MDTypography
                      variant="caption"
                      ml={"10px"}
                      sx={{
                        color: "#F1F1F1",
                        fontSize: "12px",
                        // fontFamily: "OpenSans",
                      }}
                    >
                      Items per page
                    </MDTypography>
                  )}
                  {row.cells.map((cell, index) => (
                    <DataTableBodyCell
                      odd={key % 2 === 0}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                      key={`table_row_cell${index}`}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
          {rows?.length === 0 && <EmptyResponseDatatable colSpan={table.columns.length} />}
        </Table>
        <Divider />
      </TableContainer>
      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDBox
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                // backgroundColor: "#1E1E1E",
                borderRadius: "22px",
                borderColor: "#282828",
                borderWidth: "1px",
              }}
            >
              <MDBox>
                <MDPagination
                  item
                  onClick={() => {
                    if (canPreviousPage) {
                      previousPage()
                    }
                  }}
                  disabled={!canPreviousPage}
                  sx={
                    {
                      // borderColor: "red",
                      // borderRadius: "2px",
                      // borderWidth: "1px",
                      // marginX: "0px",
                      // height: "44px",
                      // width: "44px",
                      // outline: "none",
                    }
                  }
                >
                  <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                </MDPagination>
              </MDBox>
              <MDBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "44px",
                  minWidth: "140px",
                  // borderColor: "red",
                  // borderWidth: "0px",
                  // borderBottomWidth: "1px",
                  // borderTopWidth: "1px",
                  // borderStyle: "solid",
                }}
              >
                <MDTypography
                  sx={{
                    fontSize: "14px",
                    // color: "blue",
                    textAlign: "center",
                    // fontFamily: "OpenSans",
                  }}
                >
                  {entriesStart} - {entriesEnd} of {rows.length}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDPagination
                  item
                  onClick={() => {
                    if (canNextPage) {
                      nextPage()
                    }
                  }}
                  disabled={!canNextPage}
                >
                  <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                </MDPagination>
              </MDBox>
            </MDBox>
          </MDBox>
        )}
        {entriesPerPage || canSearch ? (
          <MDBox display="flex" justifyContent="space-between" alignItems="center" ml={"20px"}>
            {entriesPerPage && (
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    setEntriesPerPage(parseInt(newValue, 10))
                  }}
                  size="small"
                  sx={{
                    width: "60px",
                    height: "44px",
                  }}
                  renderInput={(params) => (
                    <MDInput
                      {...params}
                      sx={{
                        width: "60px",
                        height: "44px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        ".MuiOutlinedInput-input": {
                          // color: "blue",
                          fontSize: "14px",
                          // fontFamily: "OpenSans",
                        },
                      }}
                    />
                  )}
                />
                {/* <MDTypography
                  variant="caption"
                  ml={"10px"}
                  sx={{
                    // color: "blue",
                    fontSize: "12px",
                    // fontFamily: "OpenSans",
                  }}
                >
                  Items per page
                </MDTypography> */}
              </MDBox>
            )}
            {canSearch && (
              <MDBox width="12rem" ml="auto">
                <MDInput
                  placeholder="Search..."
                  value={search}
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => {
                    setSearch(search)
                    onSearchChange(currentTarget.value)
                  }}
                />
              </MDBox>
            )}
          </MDBox>
        ) : null}
      </MDBox>
    </MDBox>
  )
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
}

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
}

export default DataTable
