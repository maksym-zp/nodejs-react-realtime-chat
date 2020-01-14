import axios from 'axios';

class AxiosController {

    deleteToken = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    isGetToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    };

    saveToken = token => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

export const axiosController = new AxiosController();
