'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';

// css
import styles from './GridSwiper.module.css';
import axiosNext from '@/app/_lib/axiosNext';
import GridSwiperSkeleton from './GridSwiperSkeleton';

// API 응답 데이터의 타입을 정의합니다.
interface Character {
  code: string;
  name: string;
  profile_image_url: string | null;
  oneliner: string;
  creator_name: string;
  hashtags: string[] | null;
}

interface ApiResponse {
  characters: Character[];
  // 페이지네이션 정보도 있지만, 이 컴포넌트에서는 characters만 사용합니다.
}

// 캐릭터 목록을 불러오는 API 함수
const fetchCharacters = async (): Promise<ApiResponse> => {
  const { data } = await axiosNext.get('/character?limit=8&sort=latest');
  return data;
};

export default function GridSwiper() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse, Error>({
    queryKey: ['mainPageCharacters'],
    queryFn: fetchCharacters,
  });

  return (
    <div className={styles.container}>
      {/* title */}
      <div className={styles.title}>이것만은 꼭!</div>
      <div className={styles.subTitle}>AI에게 추천받은 캐릭터들을 소개합니다.</div>

      {/* 2. 삼항 연산자를 사용해 로딩, 에러, 성공 상태에 따라 다른 UI를 보여줍니다. */}
      {isLoading ? (
        <GridSwiperSkeleton />
      ) : isError ? (
        <p>오류가 발생했습니다: {error.message}</p>
      ) : (
        <div className={styles.grid}>
          {data?.characters.map(char => (
            <Link href={`/characters/${char.code}`} key={char.code} className={styles.cardLink}>
              <div className={styles.card}>
                {/* 이미지 영역 */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={char.profile_image_url || '/default-profile.png'}
                    alt={`${char.name}의 프로필`}
                    width={300}
                    height={300}
                    className={styles.img}
                  />
                </div>
                {/* 텍스트 정보 영역 */}
                <div className={styles.info}>
                  <p className={styles.name}>{char.name}</p>
                  <p className={styles.oneliner}>{char.oneliner}</p>
                  <div className={styles.tagList}>
                    {char.hashtags?.map((tag, idx) => (
                      <p key={idx} className={styles.tag}>
                        {tag}
                      </p>
                    ))}
                  </div>
                  <p className={styles.creator}>@{char.creator_name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
