import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    allInventoryHistoryAsync,
    getInventoryAsync,
    getInventoryBalanceForToday,
    getReservationsBetweenDates,
    getUsersAsync,
    myInventoryAsync,
    myInventoryHistoryAsync,
    returnInventoryAsync,
    userAddInventoryAsync,
} from '../services/API';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';

const fetchInventoryPrefix = 'inventory/GET_INVENTORY';
const fetchMyHistoryPrefix = 'inventory/GET_MY_HISTORY';
const fetchMyInventoryPrefix = 'inventory/GET_MY_INVENTORY';
const fetchAllHistoryPrefix = 'inventory/GET_ALL_HISTORY';
const fetchUsersPrefix = 'inventory/GET_USERS';
const postUserTakeInventoryPrefix = 'inventory/POST_USER_TAKE_INVENTORY';
const postUserReturnInventoryPrefix = 'inventory/POST_USER_RETURN_INVENTORY';
const fetchCheckDatesPrefix = 'inventory/GET_CHECK_DATES';
const fetchInventoryBalanceForTodayPrefix = 'inventory/GET_INVENTORY_BALANCE_FOR_TODAY';

export const fetchInventory = createAsyncThunk(fetchInventoryPrefix, async (token) => {
    const response = await getInventoryAsync(token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchMyHistory = createAsyncThunk(fetchMyHistoryPrefix, async (userToken) => {
    const { userId, token } = userToken;
    const response = await myInventoryHistoryAsync(userId, token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchMyInventory = createAsyncThunk(fetchMyInventoryPrefix, async (userToken) => {
    const { userId, token } = userToken;
    const response = await myInventoryAsync(userId, token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchAllHistory = createAsyncThunk(fetchAllHistoryPrefix, async (token) => {
    const response = await allInventoryHistoryAsync(token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchAllUsers = createAsyncThunk(fetchUsersPrefix, async (token) => {
    const response = await getUsersAsync(token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const postUserTakeInventory = createAsyncThunk(postUserTakeInventoryPrefix, async (data) => {
    const { userId, cart, token } = data;
    const response = await userAddInventoryAsync(userId, cart, token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const postUserReturnInventory = createAsyncThunk(postUserReturnInventoryPrefix, async (data) => {
    const { userId, cart, token } = data;
    const response = await returnInventoryAsync(userId, cart, token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchCheckDates = createAsyncThunk(fetchCheckDatesPrefix, async (data) => {
    const { checkDatesObject, token } = data;
    const response = await getReservationsBetweenDates(checkDatesObject, token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});

export const fetchInventoryBalanceForToday = createAsyncThunk(fetchInventoryBalanceForTodayPrefix, async (token) => {
    const response = await getInventoryBalanceForToday(token);
    if (response.status === 'SUCCESS') {
        return response.data;
    }
    return [];
});
