const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",

  MANAGEMENT: "/administracion",
  MANAGE_USERS: "/administracion/administrar-usuarios",
  CONFIGURATION_USERS: "/administracion/configurar-usuarios",

  REGISTRATIONS_UPDATES: "/altas-modificaciones",
  CLIENTS: "/altas-modificaciones/clientes",
  SUPPLIERS: "/altas-modificaciones/proveedores",
  OWNERS: "/altas-modificaciones/propietarios-empresas",
  DRIVERS: "/altas-modificaciones/choferes",
  TRUCKS: "/altas-modificaciones/camiones",
  WAGONS: "/altas-modificaciones/carretas",

  INVOICES: "/facturacion",
  SUPPLIER_INVOICES: "/facturacion/proveedores",

  TRIPS: "/viajes",
  CRTS: "/viajes/crts",
  NEW_CRT: "/viajes/crts/new",
  EDIT_CRT: (id) => `/viajes/crts/${id}`,
  DTAS: "/viajes/dtas",
  NEW_DTA: `/viajes/dtas/new`,
  EDIT_DTA: (id) => `/viajes/dtas/${id}`,
}

export default ROUTES
