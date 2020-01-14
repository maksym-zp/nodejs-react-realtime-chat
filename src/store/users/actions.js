export const ALL_USERS = 'ALL_USERS';

export const getUsers = () => ({
    type: ALL_USERS,
    request: {
        method: 'GET',
        url: '/api/users'
    }
});