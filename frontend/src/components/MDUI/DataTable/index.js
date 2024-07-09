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

import { useMemo } from "react"

// prop-types is a library for typechecking of props
import PropTypes from "prop-types"

// react-table components
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table"

// @mui material components
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"

// Material Dashboard 2 PRO React components
import MDBox from "components/MDUI/MDBox"

// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell"
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell"
import colors from "assets/theme/base/colors"
import boxShadows from "assets/theme/base/boxShadows"
import { LinearProgress, Pagination } from "@mui/material"

const stickyHeaderStyles = {
  position: "sticky",
  top: 0,
  zIndex: 2,
}

function DataTable({
  entriesCount,
  pageSize,
  currentPage,
  onPageChange,
  table,
  isSorted,
  noEndBorder,
  showSideBorder,
  loading,
  tableCaption=null,
}) {
  const columns = useMemo(() => table.columns, [table])
  const data = useMemo(() => table.rows, [table])

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  )
  const { lg } = boxShadows

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, page } = tableInstance

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce"
    } else if (isSorted) {
      sortedValue = "none"
    } else {
      sortedValue = false
    }

    return sortedValue
  }

  return (
    <>
      <TableContainer sx={{ boxShadow: lg }}>
        {loading && <LinearProgress />}

        <Table {...getTableProps()}>
          {tableCaption &&
            <caption>
              {tableCaption}
            </caption>
          }
          <MDBox
            component="thead"
            sx={{
              bgcolor: colors.primary.main,
              ...stickyHeaderStyles,
            }}
          >
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <DataTableHeadCell
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
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
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => (
                    <DataTableBodyCell
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                      showSideBorder={showSideBorder && cellIndex < row.cells.length - 1}
                      maxWidth={cell.column?.maxWidth}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <MDBox display="flex" justifyContent="flex-end" paddingTop={1}>
        {!!entriesCount && !!currentPage && !!onPageChange && (
          <Pagination
            count={Math.ceil(entriesCount / pageSize)}
            page={currentPage}
            onChange={onPageChange}
          />
        )}
      </MDBox>
    </>
  )
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  isSorted: false,
  noEndBorder: false,
}

// Typechecking props for the DataTable
DataTable.propTypes = {
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
}

export default DataTable
