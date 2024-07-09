import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { ApiBase, ApiReturnType } from "./api-base"
import { API_VERSION_PREFIX } from "../../utils/constants"

/**
 * Manages all requests to the API.
 */
export class Api extends ApiBase {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config)
  }
  // AUTH
  login(username: string, password: string): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/authenticate/`, {
      email: username,
      password,
    })
  }

  signup(data: any): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/`, data)
  }

  verifyLogin(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/client/verify/login/`, data)
  }

  forgotPassword(email: string): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/password/send-reset-link/`, { email: email })
  }

  resetPassword(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/password/reset/`, data)
  }

  changePassword(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/password/change/`, data)
  }

  // USER
  getUsers(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/users/`, params)
  }

  getUser(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/users/${id}/`)
  }

  createUser(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/users/`, data)
  }

  updateUser(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/users/${id}/`, data)
  }

  deleteUser(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/users/${id}/`)
  }

  // USER GROUPS
  getGroups(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/groups/`, params)
  }

  getGroup(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/groups/${id}/`)
  }

  createGroup(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/groups/`, data)
  }

  updateGroup(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/groups/${id}/`, data)
  }

  deleteGroup(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/groups/${id}/`)
  }
  // GROUP PERMISSIONS
  getPermissions(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/permissions/`, params)
  }

  // CONFIGURATIONS
  getConfigurations() {
    return this.simple_get(`${API_VERSION_PREFIX}/configuration/`)
  }
  updateConfiguration(key: string, value: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/configuration/${key}/`, { value: value })
  }
  updateConfigurations(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/configuration/update-configurations/`, data)
  }

  // CLIENTS
  getClients(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/client/`, params)
  }

  getClient(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/client/${id}/`)
  }

  createClient(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/client/`, data)
  }

  updateClient(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/client/${id}/`, data)
  }

  deleteClient(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/client/${id}/`)
  }

  // OWNERS
  getOwners(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/owner/`, params)
  }

  getOwner(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/owner/${id}/`)
  }

  createOwner(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/owner/`, data)
  }

  updateOwner(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/owner/${id}/`, data)
  }

  deleteOwner(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/owner/${id}/`)
  }

  // DRIVERS
  getDrivers(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/driver/`, params)
  }

  getDriver(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/driver/${id}/`)
  }

  createDriver(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/driver/`, data)
  }

  updateDriver(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/driver/${id}/`, data)
  }

  deleteDriver(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/driver/${id}/`)
  }

  // SUPPLIERS
  getSuppliers(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/supplier/`, params)
  }

  getSupplier(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/supplier/${id}/`)
  }

  createSupplier(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/supplier/`, data)
  }

  updateSupplier(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/supplier/${id}/`, data)
  }

  deleteSupplier(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/supplier/${id}/`)
  }

  // TRUCKS
  getTrucks(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/truck/`, params)
  }

  getTruck(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/truck/${id}/`)
  }

  createTruck(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/truck/`, data)
  }

  updateTruck(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/truck/${id}/`, data)
  }

  deleteTruck(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/truck/${id}/`)
  }

  // TRAILERS
  getTrailers(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/trailer/`, params)
  }

  getTrailer(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/trailer/${id}/`)
  }

  createTrailer(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/trailer/`, data)
  }

  updateTrailer(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/trailer/${id}/`, data)
  }

  deleteTrailer(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/trailer/${id}/`)
  }

  // SUPPLIER INVOICE
  getSupplierInvoices(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/invoice/supplier/`, params)
  }

  getSupplierInvoice(id: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/invoice/supplier/${id}/`)
  }

  createSupplierInvoice(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/invoice/supplier/`, data)
  }

  updateSupplierInvoice(id: any, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/invoice/supplier/${id}/`, data)
  }

  deleteSupplierInvoice(id: any) {
    return this.simple_delete(`${API_VERSION_PREFIX}/invoice/supplier/${id}/`)
  }

  // CITIES LIGHT
  getCities(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/city/`, params)
  }

  // CRTS
  getMerchandiseValueTypes() {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/crt/merchandise-value-type/`)
  }
  getCRTs() {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/crt/`)
  }

  getCRT(id: number) {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/crt/${id}/`)
  }

  getCRTNumber() {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/crt/next-crt-number/`)
  }

  deleteCRT(id: number) {
    return this.simple_delete(`${API_VERSION_PREFIX}/trip/crt/${id}/`)
  }

  createCRT(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/trip/crt/`, data)
  }

  updateCRT(id: number, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/trip/crt/${id}/`, data)
  }

  getCountryCities(params: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/country-city/`, params)
  }

  // DTAS
  getDTAs() {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/dta/`)
  }

  getDTA(id: number) {
    return this.simple_get(`${API_VERSION_PREFIX}/trip/dta/${id}/`)
  }

  deleteDTA(id: number) {
    return this.simple_delete(`${API_VERSION_PREFIX}/trip/dta/${id}/`)
  }

  createDTA(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/trip/dta/`, data)
  }

  updateDTA(id: number, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/trip/dta/${id}/`, data)
  }

}
