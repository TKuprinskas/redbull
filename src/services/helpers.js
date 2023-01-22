import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

export function getTokenFromStorage() {
    if (window.localStorage.getItem('token')) {
        const token = window.localStorage.getItem('token');
        return token;
    } else {
        return null;
    }
}

export function getUserIdFromToken() {
    if (window.localStorage.getItem('token')) {
        const token = window.localStorage.getItem('token');
        const payload = token.split('.')[1];
        const payloadDecoded = window.atob(payload);
        const userId = JSON.parse(payloadDecoded).user_id;
        return userId;
    } else {
        return null;
    }
}

export function getUserRoleFromToken() {
    if (window.localStorage.getItem('token')) {
        const token = window.localStorage.getItem('token');
        const payload = token.split('.')[1];
        const payloadDecoded = window.atob(payload);
        const userId = JSON.parse(payloadDecoded).role;
        return userId;
    } else {
        return null;
    }
}

export const toastSuccess = (message) => {
    toast.success(message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const toastInfo = (message) => {
    toast.info(message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const toastError = (message) => {
    toast.error(message, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const currentDate = () => {
    const date = new Date();
    const currentDate = moment(date).format('YYYY-MM-DD');
    return currentDate;
};

export const currentTime = () => {
    const date = new Date();
    const currentTime = moment(date).format('HH:mm');
    return currentTime;
};
