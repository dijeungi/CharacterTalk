// 전화번호 포맷 함수
export const formatPhone = (value: string) => {
  const raw = value.replace(/\D/g, '');
  if (raw.length < 4) return raw;
  if (raw.length < 8) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};
