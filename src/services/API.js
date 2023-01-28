import { toastSuccess, toastInfo, toastError } from './helpers';
import 'react-toastify/dist/ReactToastify.css';

const createUserURL = `${process.env.REACT_APP_API_URL}/redbull/auth/create-user`;
const loginURL = `${process.env.REACT_APP_API_URL}/redbull/auth/login`;
const getUsersURL = `${process.env.REACT_APP_API_URL}/redbull/auth/get-user-data`;
const resetPassURL = `${process.env.REACT_APP_API_URL}/redbull/auth/edit-user-data`;
const deleteUserURL = `${process.env.REACT_APP_API_URL}/redbull/auth/delete-user`;
const getInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/inventory`;
const addInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/add-inventory`;
const deleteInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/delete-inventory`;
const editInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/update-inventory`;
const userAddInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/add-user-inventory`;
const myInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/my-inventory`;
const returnInventoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/return-inventory`;
const myInventoryHistoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/my-all-inventory`;
const allInventoryHistoryURL = `${process.env.REACT_APP_API_URL}/redbull/inventory/all-inventory`;

export const createUserAsync = async (username, password, token) => {
    try {
        const response = await fetch(createUserURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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

export const changeResetPassAsync = async (password, id, token) => {
    try {
        const response = await fetch(`${resetPassURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
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

export const getInventoryAsync = async (token) => {
    try {
        const response = await fetch(getInventoryURL, {
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

export const addInventoryAsync = async (name, quantity, comment, token) => {
    try {
        const response = await fetch(addInventoryURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                quantity: quantity,
                comment: comment,
            }),
        });
        const data = await response.json();
        if (data.status === 'SUCCESS') {
            toastSuccess('Invetorius sėkmingai pridėtas');
            return data;
        } else {
            toastError(data.err);
        }
    } catch (err) {
        console.log(err);
    }
};

export const deleteInventoryAsync = async (token, id) => {
    try {
        const response = await fetch(`${deleteInventoryURL}/${id}`, {
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
            toastSuccess('Inventorius ištrintas sėkmingai');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const editInventoryAsync = async (id, quantityDifference, name, quantity, comment, token) => {
    try {
        const response = await fetch(`${editInventoryURL}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: id,
                quantityDifference: quantityDifference,
                name: name,
                quantity: quantity,
                comment: comment,
            }),
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            toastSuccess('Inventorius sėkmingai atnaujintas');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const userAddInventoryAsync = async (userId, items, token) => {
    try {
        const response = await fetch(`${userAddInventoryURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                items: items,
            }),
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            toastSuccess('Inventorius sėkmingai paimtas');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const myInventoryAsync = async (userId, token) => {
    try {
        const response = await fetch(`${myInventoryURL}/${userId}`, {
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

export const returnInventoryAsync = async (userId, items, token) => {
    try {
        const response = await fetch(`${returnInventoryURL}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                items: items,
            }),
        });
        const data = await response.json();
        if (data.err) {
            toastError(data.err);
        } else {
            toastSuccess('Inventorius sėkmingai grąžintas');
            return data;
        }
    } catch (err) {
        console.log(err);
    }
};

export const myInventoryHistoryAsync = async (userId, token) => {
    try {
        const response = await fetch(`${myInventoryHistoryURL}/${userId}`, {
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

export const allInventoryHistoryAsync = async (token) => {
    try {
        const response = await fetch(`${allInventoryHistoryURL}`, {
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
