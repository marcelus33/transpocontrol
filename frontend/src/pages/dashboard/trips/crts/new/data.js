import DefaultCell from "../../../../../components/MDUI/DataTable/DefaultCell"
import * as Yup from "yup"

const getDataTableHeaders = () => ({
  columns: [
    {
      Header: "Gastos a pagar",
      accessor: "description",
    },
    {
      Header: "Monto remitente",
      accessor: "sender_amount",
      width: "20%",
      Cell: ({ row }) => <DefaultCell value={row.original.sender_amount.amount || "--"} />
    },
    {
      Header: "Monto destinatario",
      accessor: "recipient_amount",
      width: "20%",
      Cell: ({ row }) => <DefaultCell value={row.original.recipient_amount.amount || "--"} />
    },
    {
      Header: "Total",
      accessor: "total",
      width: "10%",
      Cell: ({ row }) => <DefaultCell value={parseFloat(row.original.sender_amount.amount) + parseFloat(row.original.recipient_amount.amount) || "--"} />
    },
  ],
})

export default getDataTableHeaders


//  Formik
const initialMoneyField = {amount: 0, currency: "USD"}
export const initialValuesCrt = (crtData) => ({
  sender: crtData?.sender || "",
  crt_number: crtData?.crt_number || "", //prepare to call the next code
  carrier: crtData?.carrier || "",
  recipient: crtData?.recipient || "",
  place_of_issue: crtData?.place_of_issue || "",
  consignee: crtData?.consignee || "",
  loading_place: crtData?.loading_place || "",
  loading_date: crtData?.loading_date || null,
  destination_place: crtData?.destination_place || "",
  notify_party: crtData?.notify_party || "",
  successive_carriers: crtData?.successive_carriers || "",
  contains: crtData?.["contains"] || "",
  gross_weight_kg: crtData?.gross_weight_kg || 0,
  net_weight_kg: crtData?.net_weight_kg || 0,
  volume_mcu: crtData?.volume_mcu || 0,
  load_value: crtData?.load_value || initialMoneyField,
  expenses: crtData?.expenses || [],
  type_merchandise_1: crtData?.type_merchandise_1 || null,
  merchandise_value_1: crtData?.merchandise_value_1 || initialMoneyField,
  type_merchandise_2: crtData?.type_merchandise_2 || null,
  addedSecondType: !!crtData?.merchandise_value_2,
  merchandise_value_2: crtData?.merchandise_value_2 || initialMoneyField,
  attached_documents: crtData?.attached_documents || "",
  customs_instructions: crtData?.customs_instructions || "",
  external_freight_amount: crtData?.external_freight_amount || initialMoneyField,
  reimbursement_amount: crtData?.reimbursement_amount || initialMoneyField,
  remarks: crtData?.remarks || "",
  carrier_name: crtData?.carrier_name || "",
  carrier_signature: crtData?.carrier_signature || "",
  carrier_signature_date: crtData?.carrier_signature_date || null,
})

const requiered_message = (field = "")  => `El campo ${field} es requerido.`

const amountValidation = Yup.object().shape({
    amount: Yup.number().required("El monto es requerido"),
    currency: Yup.string().default("USD").notRequired(),
  })

export const validationSchemaCrt = Yup.object().shape({
  sender: Yup.string().required(requiered_message("destinatario")),
  crt_number: Yup.string().required(requiered_message("nro. CRT")),
  carrier: Yup.string().required(requiered_message("portador")),
  recipient: Yup.string().required(requiered_message("remitente")),
  place_of_issue: Yup.string().required(requiered_message("lugar de emisión")),
  consignee: Yup.string().required(requiered_message("consignatario")),
  loading_place:  Yup.string().required(requiered_message("lugar de carga")),
  loading_date:  Yup.date().required(requiered_message("fecha de carga")),
  destination_place: Yup.string().required(requiered_message("ciudad y país destino")),
  notify_party:  Yup.string().required(requiered_message("notificar a")),
  successive_carriers: Yup.string().required(requiered_message("transport. sucesivos")),
  contains: Yup.string().required("Este campo es requerido"),
  gross_weight_kg: Yup.number().required(requiered_message("peso bruto")),
  net_weight_kg: Yup.number().required(requiered_message("peso neto")),
  volume_mcu: Yup.number().required(requiered_message("volumen")),
  load_value: amountValidation,
  expenses: Yup.array().of(Yup.object({
    description: Yup.string().required(),
    sender_amount: amountValidation,
    recipient_amount: amountValidation,
  })),
  type_merchandise_1: Yup.mixed().required(requiered_message("tipo de declaración")),
  merchandise_value_1: amountValidation,

  addedSecondType: Yup.boolean(),
  type_merchandise_2: Yup.mixed().when(
    "addedSecondType", ([addedSecondType], schema) => {
    return addedSecondType ? schema.required(requiered_message("tipo de declaración")) : schema.nullable()
  }),
  merchandise_value_2: Yup.mixed().when(
  "addedSecondType", ([addedSecondType], schema) => {
    return addedSecondType ?
      Yup.object().shape({
        amount: Yup.number().required("El monto es requerido"),
        currency: Yup.string().default("USD")
      }) :
      Yup.mixed().nullable().default(null);
  }),




// type_merchandise_2: Yup.mixed().required(requiered_message("tipo de declaración")),
  // merchandise_value_2: amountValidation,

  attached_documents: Yup.string().nullable(),
  customs_instructions: Yup.string().nullable(),
  external_freight_amount: amountValidation,
  reimbursement_amount: amountValidation,
  remarks: Yup.string().nullable(),
  carrier_name: Yup.string().required(requiered_message("nombre")),
  carrier_signature: Yup.string().required(requiered_message("firma")),
  carrier_signature_date: Yup.date().required(requiered_message("fecha")),
})
