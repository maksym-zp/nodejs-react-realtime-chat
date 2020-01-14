export const CREATE_MESSAGE = 'CREATE_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const GET_ALL_MESSAGES = 'GET_ALL_MESSAGES';

export const addMessage = data => ({
    type: CREATE_MESSAGE,
    request: {
        method: 'POST',
        url: '/api/message/create',
        data
    }
});

export const deleteMessage = (id) => ({
    type: DELETE_MESSAGE,
    request: {
        method: 'DELETE',
        url: `/api/message/${id}`,
        id
    }
});

export const editMessage = (data, id) => ({
    type: EDIT_MESSAGE,
    request: {
        method: 'POST',
        url: `/api/message/${id}`,
        data
    }
});

export const getMessages = data => ({
    type: GET_ALL_MESSAGES,
    request: {
        method: 'GET',
        url: '/api/messages',
        data
    }
});