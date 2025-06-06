import Swal from 'sweetalert2';

/** SweetAlert2 Toast 함수 입니다. */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
