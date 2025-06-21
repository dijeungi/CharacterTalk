// app/_apis/character/generate.ts
import axiosInstance from '@/app/lib/axiosInstance';

export const requestGenerateCharacterImage = async ({
  prompt,
  width,
  height,
  num_images,
}: {
  prompt: string;
  width: number;
  height: number;
  num_images: number;
}) => {
  const res = await axiosInstance.post('/generate/', {
    prompt,
    width,
    height,
    num_images,
  });
  return res.data;
};
