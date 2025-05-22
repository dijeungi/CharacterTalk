import { useEffect, useState } from 'react';

export const useTempUser = (dispatch: React.Dispatch<any>) => {
  const [oauthInfo, setOauthInfo] = useState({ email: '', oauth: '' });

  useEffect(() => {
    const tempId = new URLSearchParams(window.location.search).get('tempId');
    if (!tempId) return;

    /*
        name이 없는 이유:
        카카오톡은 별명을 사용하기 때문에 실명이 아닐 수 있으므로
        사용자가 입력한 FormData를 사용하여 DB에 저장합니다.
    */
    fetch(`/api/auth/temp-user?tempId=${tempId}`)
      .then(res => res.json())
      .then(data => {
        if (!data?.email) return;
        dispatch({ name: 'nickName', value: data.nick_name });
        setOauthInfo({ email: data.email, oauth: data.oauth });
      });
  }, [dispatch]);

  return oauthInfo;
};
