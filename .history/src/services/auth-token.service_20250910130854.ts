import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';

export const saveTokenStorage = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1,          // 1 день
    sameSite: 'strict',
    secure: false,       // true в проде (https)
  });
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY) || null;

export const removeFromStorage = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};
