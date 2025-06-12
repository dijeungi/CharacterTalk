import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../lib/axiosInstance';

export const useTempUser = (tempId: string | null, dispatch: React.Dispatch<any>) => {
  const { data } = useQuery({
    queryKey: ['tempUser', tempId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/auth/temp-user`, {
        params: { tempId },
      });
      return res.data;
    },
    enabled: !!tempId,
    onSuccess: userData => {
      if (userData?.email) {
        dispatch({ name: 'nickName', value: userData.nick_name });
      }
    },
  });

  return { email: data?.email ?? '', oauth: data?.oauth ?? '' };
};
