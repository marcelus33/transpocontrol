import moment from "moment"
import numeral from "numeral"

import { useMediaQuery } from "@mui/material"

import { useStores } from "models/root-store/root-store-context"

import Toast from "components/UI/Toast"
import theme from "assets/theme"
import { APP_CONFIG } from "./constants"

export const useIsMobile = () => {
  return useMediaQuery(theme.breakpoints.down("lg"))
}

export const showMessage = (
  error = "An error occurred while communicating with the server, please try again in a few moments",
  type = "error",
) => {
  Toast.fire({
    icon: type,
    title: error,
  })
}

export const showMessageSuccess = (message = "Operation successful") => {
  showMessage(message, "success")
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const money_fmt = (monto) => {
  return numeral(monto).format("$0,0.00")
}

export const count_fmt = (monto) => {
  return numeral(monto).format("0,0")
}

export const date_fmt = (fecha, formato_opcional) => {
  const mm = moment(fecha)
  return mm.format(formato_opcional ? formato_opcional : "MM/DD/YYYY - hh:mm A")
}

/**
 * Formatea una fecha en el formato YYYY-MM-DD.
 * @param {any} date - La fecha a formatear.
 * @returns {string|null} - La fecha formateada o null si la fecha no es válida.
 */
export const formatDate = (date) => {
  if (!(date instanceof Date) && typeof date !== 'string' && !moment.isMoment(date)) {
    console.error('Invalid date type provided:', date);
    return null;
  }

  // Verificar si la fecha es válida usando moment
  if (!moment(date).isValid()) {
    console.error('Invalid date provided:', date);
    return null;
  }

  // Formatear la fecha a YYYY-MM-DD
  return moment(date).format('YYYY-MM-DD');
}

export const formatDateForDisplay = (dateStr) => {
  let date = new Date(dateStr);
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month is zero-indexed, add 1 to get correct month
  let year = date.getFullYear() % 100;
  return `${day}/${month}/${year}`;
}

export const useApi = () => {
  const rootStore = useStores()
  return rootStore.environment.api
}

export const useLoginStore = () => {
  const rootStore = useStores()
  return rootStore.loginStore
}

export const truncate = (input, size) =>
  input && input.length > size ? `${input.substring(0, size)}...` : input

export const getErrorMessages = (err) => {
  let message = ""
  for (let k of Object.keys(err)) {
    message += err[k].join(". ")
  }
  return message
}

export const formatNumberToCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num)

export const loadDictForm = (objBase, objData) => {
  let newObject = {}
  Object.keys(objBase).forEach(function(key, index) {
    newObject[key] = objData[key] ? objData[key] : objBase[key]
  })

  return newObject
}

export const transformObjectsToId = (object, list_of_keys_to_convert) => {
  const newObj = {}
  Object.keys(object).forEach(function(key) {
    if (list_of_keys_to_convert.includes(key)) {
      if (object[key] !== null && object[key].id !== undefined) {
        newObj[key] = object[key].id
      } else {
        newObj[key] = null
      }
    } else {
      newObj[key] = object[key]
    }
  })
  return newObj
}

export const collect_files = (data) => {
  const files = []
  data = collect_files_internal(data, "", files)
  return [data, files]
}

const collect_files_internal = (objekt, current_path, collector) => {
  if (objekt === null || objekt === undefined) {
    return objekt
  }
  if (typeof document !== "undefined") {
    // I'm on the web!
    if (objekt instanceof File) {
      collector.push([current_path, objekt])
      return null
    }
  } else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    // I'm in react-native
    if (objekt instanceof RNFile) {
      collector.push([current_path, objekt])
      return null
    } else if (objekt instanceof File || objekt instanceof Blob) {
      throw new Error(
        "You are using react-native, but you passed a File/Blob object instead of a RNFile object",
      )
    }
  }
  if (objekt instanceof File) {
    collector.push([current_path, objekt])
    return null
  }
  const sep = current_path === "" ? "" : "."
  if (objekt.constructor === Array && objekt.map) {
    return objekt.map((el, index) => {
      return collect_files_internal(el, `${current_path}${sep}[${index}]`, collector)
    })
  }
  if (typeof objekt === "object") {
    const res = {}
    Object.entries(objekt).forEach(([key, el]) => {
      res[key] = collect_files_internal(el, `${current_path}${sep}${key}`, collector)
    })
    return res
  }
  return objekt
}

export const openInNewTab = (url) => {
  window.open(url, "_blank", "noreferrer")
}

export const convertStringToList = (text) => {
  if (text) {
    return text.replace(/\n/g, "<br/>")
  } else {
    return ""
  }
}

/**
 * Truncates a given text to a specified maximum length.
 * @param {string} text - The text to be truncated.
 * @param {number} maxLength - The maximum length of the truncated text.
 * @returns {string} The truncated text.
 */
export const truncateText = (text, maxLength) => {
  if (typeof text !== "string") {
    throw new TypeError("Expected text to be a string")
  }
  if (typeof maxLength !== "number") {
    throw new TypeError("Expected maxLength to be a number")
  }
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text
}


export const getZIndexLevel = (level) => level > 0 ? APP_CONFIG.BASE_Z_INDEX + level : APP_CONFIG.BASE_Z_INDEX

export const CURRENCIES = [
  {id: 'USD'},
  {id: 'PYG'},
  {id: 'BOB'},
  {id: 'ARS'},
  {id: 'BRL'},
  {id: 'UYU'},
  {id: 'CLP'},
  {id: 'PEN'},
]