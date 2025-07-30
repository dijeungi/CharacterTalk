/**
 * @file         frontend/app/_config/middlewareConfig.ts
 * @desc         Middleware에서 사용하는 설정 값 (인증 예외 경로 등)
 *
 * @author       최준호
 * @update       2025.07.30
 */

/**
 * @description 인증 검사를 건너뛸 경로 목록입니다.
 *              정규식을 사용하여 동적 경로를 포함한 복잡한 패턴 매칭이 가능합니다.
 *              정규식을 사용하는 이유:
 *              - 동적 경로 지원: `/characters/[code]`와 같이 변하는 값을 가진 경로를 정확히 지정할 수 있습니다.
 *              - 정밀한 제어: 단순 문자열 비교(`startsWith`)로는 불가능한 세밀한 경로 규칙을 설정할 수 있습니다.
 *              - 유지보수성: 새로운 예외 경로를 추가하거나 수정할 때, 이 배열만 관리하면 되므로 관리가 용이합니다.
 */
export const publicPaths = [
  /**
   * @pattern    /^\/characters\/[^/]+$/
   * @description /characters/ 뒤에 슬래시(/)가 없는 모든 문자가 1개 이상 오는 경로와 일치합니다.
   *              (e.g., /characters/123, /characters/abc-xyz)
   *              하지만 /characters/new, /characters/123/edit 등은 포함하지 않습니다.
   */
  /^\/characters\/[^/]+$/,

  /**
   * @pattern    /^\/test(\/.*)?$/
   * @description /test로 시작하고, 그 뒤에 하위 경로가 있거나 없는 모든 경로와 일치합니다.
   *              (e.g., /test, /test/a, /test/a/b)
   *              테스트 목적으로 추가된 경로입니다.
   */
  /^\/test(\/.*)?$/,
];

/**
 * @description Middleware의 인증 로직 자체는 통과시키지만,
 *              토큰이 없어도 최종적으로 API 요청을 허용해야 하는 API 경로 목록입니다.
 *              주로 로그인, 회원가입, 토큰 갱신 등 인증 이전에 호출되어야 하는 API가 포함됩니다.
 */
export const ignoredApiPaths = [
  '/api/user',
  '/api/auth/signup',
  '/api/auth/refresh',
  '/api/auth/temp-user',
  '/api/auth/callback/kakao',
  '/api/character',
  '/api/user/characters',
];
