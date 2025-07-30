// @ts-ignore

// next.config.ts
// Next.js 프로젝트 전역 설정 파일
// 기본적으로 건드리지 않아도 되며, 필요 시 옵션 추가

const nextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: [
    'https://3000-firebase-charactertalkgit-1747715584709.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'charactertalk.abc3151c9a8993bf41e4e6f6f4660cdd.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
