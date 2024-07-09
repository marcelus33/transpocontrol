import ROUTES from "routes/routes"

import {
  AdministracionIcon,
  AltasModificacionesIcon,
  FacturacionIcon,
  ViajesIcon,
} from "../assets/theme/components/SvgIcons"

// Dashboard Pages
import ManageUsers from "pages/dashboard/management/manage-users"
import ConfigureUsers from "pages/dashboard/management/configure-users"
import Clients from "pages/dashboard/registrations-updates/clients"
import Owners from "pages/dashboard/registrations-updates/owners"
import Trucks from "pages/dashboard/registrations-updates/trucks"
import Suppliers from "../pages/dashboard/registrations-updates/suppliers"
import Wagons from "pages/dashboard/registrations-updates/wagons"
import Crts from "../pages/dashboard/trips/crts"
import NewCrt from "../pages/dashboard/trips/crts/new"
import Drivers from "../pages/dashboard/registrations-updates/drivers"
import DTAListPage from "../pages/dashboard/trips/dtas"
import SupplierInvoices from "../pages/dashboard/invoices/supplier-invoices"

const routes = [
  {
    key: ROUTES.NEW_CRT,
    route: ROUTES.NEW_CRT,
    component: <NewCrt />,
  },
  {
    key: ROUTES.MANAGEMENT,
    type: "collapse",
    route: ROUTES.MANAGEMENT,
    name: "Administración",
    icon: <AdministracionIcon />,
    collapse: [
      {
        key: ROUTES.MANAGE_USERS,
        name: "Administración de Usuarios",
        route: ROUTES.MANAGE_USERS,
        component: <ManageUsers />,
      },
    ],
  },
  {
    key: "/viajes",
    type: "collapse",
    route: "/viajes",
    name: "Viajes",
    icon: <ViajesIcon />,
    collapse: [
      {
        name: "CRTs",
        route: ROUTES.CRTS,
        key: ROUTES.CRTS,
        component: <Crts />,
      },
      {
        name: "MIC/DTAs",
        route: ROUTES.DTAS,
        key: ROUTES.DTAS,
        component: <DTAListPage />,
      },
    ],
  },
  {
    key: ROUTES.REGISTRATIONS_UPDATES,
    type: "collapse",
    route: ROUTES.REGISTRATIONS_UPDATES,
    name: "Altas y Modificaciones",
    icon: <AltasModificacionesIcon />,
    collapse: [
      {
        key: ROUTES.CLIENTS,
        name: "Clientes",
        route: ROUTES.CLIENTS,
        component: <Clients />,
      },
      {
        key: ROUTES.SUPPLIERS,
        name: "Proveedores",
        route: ROUTES.SUPPLIERS,
        component: <Suppliers />,
      },
      {
        key: ROUTES.OWNERS,
        name: "Propietarios / Empresas",
        route: ROUTES.OWNERS,
        component: <Owners />,
      },
      {
        key: ROUTES.DRIVERS,
        name: "Choferes",
        route: ROUTES.DRIVERS,
        component: <Drivers />,
      },
      {
        key: ROUTES.TRUCKS,
        name: "Tractocamiones",
        route: ROUTES.TRUCKS,
        component: <Trucks />,
      },
      {
        key: ROUTES.WAGONS,
        name: "Semiremoques",
        route: ROUTES.WAGONS,
        component: <Wagons />,
      },
    ],
  },
  {
    key: ROUTES.INVOICES,
    type: "collapse",
    route: ROUTES.INVOICES,
    name: "Facturación",
    icon: <FacturacionIcon />,
    collapse: [
      {
        name: "Facturas proveedor",
        route: ROUTES.SUPPLIER_INVOICES,
        key: ROUTES.SUPPLIER_INVOICES,
        component: <SupplierInvoices />,
      },
    ],
  },
]

export default routes
