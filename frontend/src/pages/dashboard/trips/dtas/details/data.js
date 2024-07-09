import * as Yup from "yup"

export const DTA_STEPS = {
  GENERAL_INFORMATION: 1,
  SHIPMENT_DETAILS: 2,
  SIGN: 3,
}

export const NEW_DTA = (dtaData) => {
  return {
  DTA_number: dtaData?.DTA_number || "",
  carrier: dtaData?.carrier || null,
  extra_1: dtaData?.extra_1 || "",
  extra_2: dtaData?.extra_2 || "",
  transito_aduanero: dtaData?.transito_aduanero || false,
  MIC_DTA_number: dtaData?.MIC_DTA_number || "",
  issue_date: dtaData?.issue_date || "",
  departure_customs: dtaData?.departure_customs || null,
  destination_city: dtaData?.destination_city || null,
  truck: dtaData?.truck || null,
  trailer: dtaData?.trailer || null,
  substitute_truck: dtaData?.substitute_truck || null,
  substitute_trailer: dtaData?.substitute_trailer || null,
  shipment_details: dtaData?.shipment_details || [{ ...DTA_EMPTY_PAGE }],
  carrier_signature: dtaData?.carrier_signature || "",
}}

export const DTA_EMPTY_PAGE = {
  bill_of_lading: "",
  currency: null,
  destination_customs: null,
  origin_goods: null,
  // FOT_value_and_currency: {amount:0, currency: null},
  FOT_value_and_currency: 0,
  freight_in_usd: 0,
  insurance_in_usd: 0,
  cargo_type: "",
  cargo_quantity: 0,
  gross_weight: 0,
  net_weight: 0,
  contains: "",
  sender: null,
  recipient: null,
  consignee: null,
  export_invoice: null,
  DTA_route: null,
  driver_1: null,
  driver_2: null,
}

const requiered_message = (field= "")  => `El campo ${field} es requerido.`

export const DTAValidationSchema = (step) => {
  let schema = {
    DTA_number: Yup.mixed().required(requiered_message()),
    carrier: Yup.mixed().required(requiered_message()),
    extra_1: Yup.string().nullable(),
    extra_2: Yup.string().nullable(),
    rol_contribuyente: Yup.string().notRequired(),
    transito_aduanero: Yup.boolean().required(requiered_message()),
    MIC_DTA_number: Yup.string().required(requiered_message()),
    issue_date: Yup.string().required(requiered_message()),
    departure_customs: Yup.mixed().required(requiered_message()),
    destination_city: Yup.mixed().required(requiered_message()),
    truck: Yup.mixed().required(requiered_message()),
    trailer: Yup.mixed().required(requiered_message()),
    hasSubstituteTruck: Yup.boolean(),
    substitute_truck: Yup.mixed().when("hasSubstituteTruck", ([hasSubstituteTruck], schema) => {
      return hasSubstituteTruck ? schema.required() : schema.nullable()
    }),
    substitute_trailer: Yup.mixed().when("hasSubstituteTruck", ([hasSubstituteTruck], schema) => {
      return hasSubstituteTruck ? schema.required() : schema.nullable()
    }),
  }

  if (step === DTA_STEPS.GENERAL_INFORMATION) {
    schema.shipment_details = Yup.array().nullable()
  } else if (step === DTA_STEPS.SHIPMENT_DETAILS) {
    schema.shipment_details = Yup.array().of(
      Yup.object().shape({
        bill_of_lading: Yup.string().required(requiered_message()),
        currency: Yup.mixed().required(requiered_message()),
        destination_customs: Yup.mixed().required(requiered_message()),
        origin_goods: Yup.mixed().required(requiered_message()),
        FOT_value_and_currency: Yup.number().required(requiered_message()),
        // FOT_value_and_currency: Yup.object().shape({
        //     amount: Yup.number().required(requiered_message()).min(0, "Campo no puede ser menor a 0"),
        //     currency:
        // }),
        freight_in_usd: Yup.number()
          .required(requiered_message())
          .min(0, "Campo no puede ser menor a 0"),
        insurance_in_usd: Yup.number()
          .required(requiered_message())
          .min(0, "Campo no puede ser menor a 0"),
        cargo_type: Yup.string().required(requiered_message()),
        cargo_quantity: Yup.number()
          .required(requiered_message())
          .min(0, "Campo no puede ser menor a 0"),
        gross_weight: Yup.number()
          .required(requiered_message())
          .min(1, "Campo no puede ser menor a 1"),
        net_weight: Yup.number()
          .required(requiered_message())
          .min(1, "Campo no puede ser menor a 1"),
        // contains: Yup.string().required(requiered_message()),
        // sender: Yup.mixed().required(requiered_message()),
        // recipient: Yup.mixed().required(requiered_message()),
        // consignee: Yup.mixed().required(requiered_message()),
        export_invoice: Yup.mixed().required(requiered_message()),
        DTA_route: Yup.string().required(requiered_message()),
        driver_1: Yup.mixed().required(requiered_message()),
        // driver_2: Yup.mixed().required(),
      })
    )
  } else if (step === DTA_STEPS.SIGN) {
    schema.carrier_signature = Yup.string().required(requiered_message())
  }

  return Yup.object().shape(schema)
}
