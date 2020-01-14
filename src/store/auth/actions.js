export const SIGN_OUT = 'SIGN_OUT';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const FETCH_AUTH_USER = 'FETCH_AUTH_USER';
export const EDIT_USER = 'EDIT_USER';
export const AUTH_REGISTER = 'AUTH_REGISTER';
export const EDIT_USER_AVATAR = 'EDIT_USER_AVATAR';

export const login = data => ({
    type: AUTH_LOGIN,
    request: {
        method: 'POST',
        url: '/api/login',
        data
    }
});

export const register = data => ({
    type: AUTH_REGISTER,
    request: {
        method: 'POST',
        url: '/api/register',
        data
    }
});

export const fetchAuthUser = () => ({
    type: FETCH_AUTH_USER,
    request: {
        method: 'GET',
        url: '/api/user-data'
    }
});
export const editUser = data => ({
    type: EDIT_USER,
    request: {
        method: 'POST',
        url: '/api/edit-user',
        data
    }
});

export const editUserAvatar = (data, userId) => ({
    type: EDIT_USER_AVATAR,
    request: {
        method: 'POST',
        url: `/api/user/${userId}/save-avatar`,
        data
    }
});

export const signOut = () => ({type: SIGN_OUT});

