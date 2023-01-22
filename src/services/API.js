import { toastSuccess, toastInfo, toastError } from './helpers';
import 'react-toastify/dist/ReactToastify.css';

const createUserURL = `http://localhost:8000/v1/redbull/auth/create-user`;
const loginURL = `http://localhost:8000/v1/redbull/auth/login`;
const getUsersURL = `http://localhost:8000/v1/redbull/auth/get-user-data`;
const resetPassURL = `http://localhost:8000/v1/redbull/auth/edit-user-data`;
const deleteUserURL = `http://localhost:8000/v1/redbull/auth/delete-user`;

export const createUserAsync = async (username, password) => {
    try {
        const response = await fetch(createUserURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        if (data.status === 'SUCCESS') {
            toastInfo('Varotojas sukurtas sėkmingai');
            return data;
        } else {
            toastError(data.err);
        }
    } catch (err) {
        console.log(err);
    }
};

export const loginAsync = async (username, password) => {
    try {
        const response = await fetch(loginURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        if (data.status === 'SUCCESS') {
            toastSuccess('Sėkmingai prisijungėte');
            window.localStorage.setItem('token', data.token);
            return data;
        } else {
            toastError(data.msg);
        }
    } catch (error) {
        toastError(error);
    }
};

export const getUsersAsync = async (token) => {
    try {
        const response = await fetch(getUsersURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            return data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const changeResetPassAsync = async (username, password, id) => {
    try {
        const response = await fetch(`${resetPassURL}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            toastSuccess('Slaptažodis pakeistas sėkmingai');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const deleteUserAsync = async (token, id) => {
    try {
        const response = await fetch(`${deleteUserURL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            toastSuccess('Vartotojas ištrintas sėkmingai');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};
