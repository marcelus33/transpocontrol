import * as Swal from "sweetalert2";
import styles from './toast.module.css'

const Toast = Swal.mixin({
  customClass : {    container : styles.miklase  },
  hideClass: {backdrop: 'swal2-backdrop-hide'},
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export default Toast