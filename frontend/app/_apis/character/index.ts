import axiosInstance from '@/app/_lib/axiosNext';

export const requestGenerateCharacterImage = async (payload: GenerateImageRequest) => {
  const res = await axiosInstance.post('/generate/', payload);
  return res.data;
};
