/**
 * @file      frontend/app/_utils/Swal.tsx
 * @desc      Util: 상단 토스트 알림 표시용 SweetAlert2 기본 설정 객체 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
