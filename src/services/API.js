import { toastSuccess, toastInfo, toastError } from './helpers';
import 'react-toastify/dist/ReactToastify.css';

const createUserURL = `${process.env.REACT_APP_API_URL}/auth/create-user`;
const loginURL = `${process.env.REACT_APP_API_URL}/auth/login`;
const getUsersURL = `${process.env.REACT_APP_API_URL}/auth/get-user-data`;
const resetPassURL = `${process.env.REACT_APP_API_URL}/auth/edit-user-data`;
const deleteUserURL = `${process.env.REACT_APP_API_URL}/auth/delete-user`;
const getInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/inventory`;
const addInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/add-inventory`;
const deleteInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/delete-inventory`;
const editInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/update-inventory`;
const userAddInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/add-user-inventory`;
const myInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/my-inventory`;
const returnInventoryURL = `${process.env.REACT_APP_API_URL}/inventory/return-inventory`;
const myInventoryHistoryURL = `${process.env.REACT_APP_API_URL}/inventory/my-all-inventory`;
const allInventoryHistoryURL = `${process.env.REACT_APP_API_URL}/inventory/all-inventory`;
const getReservationsBetweenDatesURL = `${process.env.REACT_APP_API_URL}/inventory/reservedAmount`;
const getInventoryBalanceForTodayURL = `${process.env.REACT_APP_API_URL}/inventory/reservedAmount/today`;

export const createUserAsync = async (username, password, token) => {
  try {
    const response = await fetch(createUserURL, {
      mode: 'cors',
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
      toastSuccess('Varotojas sukurtas sėkmingai');
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
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

export const editInventoryAsync = async (
  id,
  quantityDifference,
  productId,
  name,
  quantity,
  comment,
  token
) => {
  try {
    const response = await fetch(`${editInventoryURL}`, {
      mode: 'cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id,
        quantityDifference: quantityDifference,
        productId: productId,
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
      mode: 'cors',
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
      mode: 'cors',
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
      mode: 'cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        userId,
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
      mode: 'cors',
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
      mode: 'cors',
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

export const getReservationsBetweenDates = async (checkDates, token) => {
  const { id, reservedFrom, reservedUntil } = checkDates;
  try {
    const response = await fetch(
      `${getReservationsBetweenDatesURL}?id=${id}&reservedFrom=${reservedFrom}&reservedUntil=${reservedUntil}`,
      {
        mode: 'cors',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

export const getInventoryBalanceForToday = async (token) => {
  try {
    const response = await fetch(`${getInventoryBalanceForTodayURL}`, {
      mode: 'cors',
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
