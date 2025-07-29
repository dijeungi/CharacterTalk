/**
 * @file      frontend/app/(routes)/(private)/characters/new/_components/Drawer/ProfileImageGeneratorDrawer.tsx
 * @desc      Component: 이미지 프롬프트, 스타일, 해상도, 개수 선택을 포함한 캐릭터 프로필 생성 Drawer UI 정의
 *
 * @author    최준호
 * @update    2025.07.21
 */

'use client';
import { useState } from 'react';
import styles from './ProfileImage.module.css';

import { FaCheck } from 'react-icons/fa';
import { SwipeableDrawer } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { Toast } from '@/app/_utils/Swal';
import { useGenerateCharacterImage } from '@/app/_apis/character/_hooks';
import { ProfileImageGeneratorDrawerProps } from '@/app/(routes)/(private)/characters/new/_types';

export default function ProfileImageGeneratorDrawer({
  open,
  onClose,
  onImageGenerated,
}: ProfileImageGeneratorDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const { mutate, isPending } = useGenerateCharacterImage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageOptions = [
    { src: '/img/ProfimeImageExample.png', alt: '1번 그림체', disabled: false },
    { src: '/img/NoImage.png', alt: '2번 그림체', disabled: true },
  ];
  const sizeOptions = [
    { value: '1024x1024', label: '1:1 정사각형', size: '1024×1024' },
    { value: '1152x896', label: '9:7', size: '1152×896' },
    { value: '986x1152', label: '7:9', size: '986×1152' },
    { value: '1216x832', label: '19:13', size: '1216×832' },
    { value: '832x1216', label: '13:19', size: '832×1216' },
    { value: '1344x768', label: '7:4 가로형', size: '1344×768' },
    { value: '768x1344', label: '4:7 세로형', size: '768×1344' },
    { value: '1536x640', label: '12:5 가로형', size: '1536×640' },
    { value: '640x1536', label: '5:12 세로형', size: '640×1536' },
  ];

  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const isFormValid =
    prompt.trim() !== '' && selectedSize !== '' && imageOptions[selectedIndex]?.disabled === false;

  const [numImages, setNumImages] = useState(1);

  // 이미지 생성 요청 프롬프트 핸들러
  const handleGenerate = () => {
    if (!prompt) {
      Toast.fire({
        icon: 'warning',
        title: '이미지에 대한 설명을 입력해주세요.',
      });
      return;
    }

    const [width, height] = selectedSize.split('x').map(Number);

    const payload = {
      prompt,
      width,
      height,
      num_images: numImages,
    };

    mutate(payload, {
      onSuccess: data => {
        const imageUrl = data.image_urls[0];

        if (imageUrl) {
          onImageGenerated(imageUrl);
          onClose();
        } else {
          Toast.fire({ icon: 'error', title: '생성된 이미지 URL이 없습니다.' });
        }
      },
      onError: () => {
        Toast.fire({ icon: 'error', title: '이미지 생성에 실패했습니다.' });
      },
    });
  };

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              backgroundColor: '#ffffff',
              color: '#000000',
              paddingTop: '1rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              paddingBottom: '2rem',
            },
          },
        }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerBar} />
          {/* 프롬프트 작성란 */}
          <div className={styles.field}>
            <label className={styles.label}>
              프롬프트 <span className={styles.required}>*</span>
            </label>
            <p className={styles.drawerText}>
              캐릭터의 외형, 분위기, 배경 등을 자유롭게 설명해주세요.
            </p>
            <div className={styles.textareaWrapper}>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="예시: 은하수를 배경으로 한 푸른 머리의 신비로운 소녀"
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>

          {/* 프로필 사진 그림체 */}
          <div className={styles.field}>
            <label className={styles.label}>
              그림체 미리보기<span className={styles.required}>*</span>
            </label>
            <p className={styles.drawerText}>
              추후에 여러 AI를 추가하여 여러 사진체를 선택하실 수 있습니다.
            </p>
            <div className={`${styles.textareaWrapper} ${styles.imageList}`}>
              {imageOptions.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.imageWrapper} ${image.disabled ? styles.disabled : ''}`}
                  onClick={() => {
                    if (!image.disabled) setSelectedIndex(index);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`${styles.profileImageExample} ${
                      selectedIndex === index ? styles.imageStyleSelected : ''
                    }`}
                  />
                  {selectedIndex === index && !image.disabled && (
                    <div className={styles.checkMark}>
                      <FaCheck />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 사진 사이즈 */}
          <div className={styles.field}>
            <label className={styles.label}>
              사진 사이즈 <span className={styles.required}>*</span>
            </label>
            <p className={styles.drawerText}>원하는 출력 비율과 해상도를 선택해주세요.</p>
            <FormControl fullWidth>
              <InputLabel id="image-size-label">사진 비율 선택</InputLabel>
              <Select
                labelId="image-size-label"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                label="사진 비율 선택"
                className={styles.select}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                      backgroundColor: '#ffffff',
                      paddingY: 0.5,
                    },
                  },
                  MenuListProps: {
                    sx: {
                      padding: 0,
                    },
                  },
                }}
              >
                {sizeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    <div className={styles.menuItem}>
                      <span className={styles.ratio}>{option.label}</span>
                      <span className={styles.size}>{option.size}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* 이미지 개수 선택 */}
          <div className={styles.field}>
            <label className={styles.label}>
              생성할 이미지 개수 <span className={styles.required}>*</span>
            </label>
            <div className={styles.buttonGroup}>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.numberButton} ${numImages === n ? styles.active : ''}`}
                  onClick={() => setNumImages(n)}
                >
                  {n}개
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fixedBottom}>
            <button
              onClick={handleGenerate}
              disabled={!isFormValid || isPending}
              className={styles.Button}
            >
              {isPending ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
}
