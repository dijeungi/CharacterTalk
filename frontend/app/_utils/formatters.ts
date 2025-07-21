/**
 * @file      frontend/app/_utils/formatters.ts
 * @desc      Util: 숫자만 추출해 휴대폰 번호 형식(000-0000-0000)으로 포맷팅하는 함수 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

export const formatPhone = (value: string) => {
  const raw = value.replace(/\D/g, '');
  if (raw.length < 4) return raw;
  if (raw.length < 8) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};
