import React from "react"
import { FieldArray } from "formik"
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, TextField, Select, MenuItem } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { CURRENCIES, TAX_TYPES } from "../../../utils/constants"
import MDButton from "../../MDUI/MDButton"
import MDBox from "../../MDUI/MDBox"
import MDTypography from "../../MDUI/MDTypography"

const InvoiceItemsTable = ({ formik }) => {
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formik.values.items]
    //
    if (field.includes(".")) {
      const field1 = field.split(".")[0]
      const field2 = field.split(".")[1]
      updatedItems[index][field1][field2] = value
    } else {
      updatedItems[index][field] = value
    }

    // Update item_total
    const quantity = updatedItems[index].quantity
    const unitPrice = updatedItems[index].unit_price.amount
    const itemTotal = quantity * unitPrice
    updatedItems[index].item_total.amount = itemTotal

    // Update tax_amount
    const taxType = updatedItems[index].tax_type
    // TODO fix tax calculation
    const taxAmount = itemTotal * (taxType / 100)
    updatedItems[index].tax_amount.amount = taxAmount

    formik.setFieldValue("items", updatedItems)
  }

  React.useEffect(() => {
    formik.values.items.forEach((item, index) => {
      handleItemChange(index, 'quantity', item.quantity)
    })
  }, [])
  //
  return (
    <FieldArray
      name="items"
      render={arrayHelpers => (
        <Table>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Tipo de Impuesto</TableCell>
              <TableCell>Monto de Impuesto</TableCell>
              <TableCell>Total del Ítem</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
            {formik.values.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    name={`items.${index}.description`}
                    value={item.description}
                    onChange={formik.handleChange}
                    error={formik.errors.items?.[index]?.description && Boolean(formik.errors.items[index].description)}
                    helperText={formik.errors.items?.[index]?.description}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name={`items.${index}.quantity`}
                    value={item.quantity}
                    type="number"
                    // onChange={formik.handleChange}
                    onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
                    error={formik.errors.items?.[index]?.quantity && Boolean(formik.errors.items[index].quantity)}
                    helperText={formik.errors.items?.[index]?.quantity}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name={`items.${index}.unit_price.amount`}
                    value={item.unit_price.amount}
                    type="number"
                    // onChange={formik.handleChange}
                    onChange={(e) => handleItemChange(index, "unit_price.amount", parseFloat(e.target.value))}
                    error={formik.errors.items?.[index]?.unit_price?.amount && Boolean(formik.errors.items[index].unit_price.amount)}
                    helperText={formik.errors.items?.[index]?.unit_price?.amount}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    style={{width: "100%", padding: "12px 0 12px 0"}}
                    name={`items.${index}.tax_type`}
                    value={item.tax_type}
                    // onChange={formik.handleChange}
                    onChange={(e) => handleItemChange(index, "tax_type", parseFloat(e.target.value))}
                    error={formik.errors.items?.[index]?.tax_type && Boolean(formik.errors.items[index].tax_type)}
                  >
                    {TAX_TYPES.map(currency => (
                      <MenuItem key={currency.id} value={currency.id}>{currency.name}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    name={`items.${index}.tax_amount.amount`}
                    value={item.tax_amount.amount}
                    type="number"
                    onChange={formik.handleChange}
                    error={formik.errors.items?.[index]?.tax_amount?.amount && Boolean(formik.errors.items[index].tax_amount.amount)}
                    helperText={formik.errors.items?.[index]?.tax_amount?.amount}
                    disabled={true}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name={`items.${index}.item_total.amount`}
                    value={item.item_total.amount}
                    type="number"
                    onChange={formik.handleChange}
                    error={formik.errors.items?.[index]?.item_total?.amount && Boolean(formik.errors.items[index].item_total.amount)}
                    helperText={formik.errors.items?.[index]?.item_total?.amount}
                    disabled={true}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => arrayHelpers.remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={7} style={{textAlign: "end"}}>
                <MDButton
                  variant="contained"
                  color="primary"
                  onClick={() => arrayHelpers.push({
                    id: new Date().getTime(),
                    quantity: 1,
                    description: "",
                    unit_price: { amount: "", currency: "PYG" },
                    tax_type: TAX_TYPES[1].id,
                    tax_amount: { amount: "", currency: "PYG" },
                    item_total: { amount: "", currency: "PYG" }
                  })}
                >
                  Agregar
                </MDButton>
              </TableCell>
            </TableRow>
        </Table>
      )}
    />
  )
}

export default InvoiceItemsTable
