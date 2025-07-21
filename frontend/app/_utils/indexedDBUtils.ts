/**
 * @file      frontend/app/_utils/indexedDBUtils.ts
 * @desc      Util: 캐릭터 임시 데이터와 이미지 저장을 위한 IndexedDB 유틸 함수 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { openDB } from 'idb';

const DB_NAME = 'characterDB';
const DB_VERSION = 1;
const DRAFT_STORE = 'draft';
const IMAGE_STORE = 'images';

export const getCharacterDB = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DRAFT_STORE)) {
        db.createObjectStore(DRAFT_STORE);
      }
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE);
      }
    },
  });
};

// 텍스트 draft 저장
export const saveDraftToDB = async (data: any) => {
  const db = await getCharacterDB();
  await db.put(DRAFT_STORE, data, 'step1');
};

// 텍스트 draft 불러오기
export const getDraftFromDB = async () => {
  const db = await getCharacterDB();
  return await db.get(DRAFT_STORE, 'step1');
};

// draft 삭제
export const deleteDraftFromDB = async () => {
  const db = await getCharacterDB();
  await db.delete(DRAFT_STORE, 'step1');
};

// 이미지 저장
export const saveImageToDB = async (key: string, blob: Blob) => {
  const db = await getCharacterDB();
  await db.put(IMAGE_STORE, blob, key);
};

// 이미지 불러오기 (URL 생성 포함)
export const getImageFromDB = async (key: string): Promise<string | null> => {
  const db = await getCharacterDB();
  const blob = await db.get(IMAGE_STORE, key);
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
};

// 이미지 삭제
export const deleteImageFromDB = async (key: string) => {
  const db = await getCharacterDB();
  await db.delete(IMAGE_STORE, key);
};
