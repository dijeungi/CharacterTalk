'use client';

// modules
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// api
import { postSignup, fetchTempUser } from '@/app/_apis/signup';
import { checkUserStatus, refreshAuthToken } from '../_apis/user';

export const useCheckUserStatus = () => {
  return useQuery<AuthState, Error>({
    queryKey: ['userStatus'],
    queryFn: checkUserStatus,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useFetchTempUser = (tempId: string | null) => {
  return useQuery<TempUserData, Error>({
    queryKey: ['tempUser', tempId],
    queryFn: () => {
      if (!tempId) {
        throw new Error('Temporary ID is required');
      }
      return fetchTempUser(tempId);
    },
    enabled: !!tempId,
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, SignupRequest>({
    mutationFn: postSignup,
    onSuccess: data => {
      console.log('Signup successful:', data);
      queryClient.invalidateQueries({ queryKey: ['userStatus'] });
    },
    onError: error => {
      console.error('Signup failed:', error.message);
    },
  });
};

export const useRefreshAuthToken = () => {
  return useMutation<any, Error>({
    mutationFn: refreshAuthToken,
    onSuccess: data => {
      console.log('Token refreshed successfully:', data);
    },
    onError: error => {
      console.error('Token refresh failed:', error.message);
    },
  });
};
