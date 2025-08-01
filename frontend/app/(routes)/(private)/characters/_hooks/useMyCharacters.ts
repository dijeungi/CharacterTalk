/**
 * @file         frontend/app/(routes)/(private)/characters/_hooks/useMyCharacters.ts
 * @desc         사용자 캐릭터 목록 조회용
 *
 * @author       최준호
 * @update       2025.08.01
 */

'use client';

import { useState, useEffect } from 'react';
import { getMyCharacters } from '@/app/_apis/user';
import { Character } from '@/app/_apis/user/types';

export function useMyCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const data = await getMyCharacters();
        setCharacters(data);
      } catch (err) {
        console.error('캐릭터 목록을 불러오는데 실패했습니다.', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return { characters, loading, error };
}
