/**
 * @route        utils
 * @file         frontend/app/_utils/Swal.tsx
 * @component    -
 * @desc         SweetAlert2 Toast 전역 설정
 *
 * @layout       -
 * @access       global
 * @props        -
 *
 * @features
 *  - 토스트 알림 전역 사용 가능
 *  - 위치, 지속 시간, 진행 바 등 기본 옵션 미리 구성
 *
 * @dependencies
 *  - sweetalert2
 *
 * @todo         필요 시 테마/아이콘 세부 옵션 추가
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.23
 */

// modules
import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
