import axiosInstance from '@/app/lib/axiosNext';

export const requestGenerateCharacterImage = async (payload: GenerateImageRequest) => {
  const res = await axiosInstance.post('/generate/', payload);
  return res.data;
};
