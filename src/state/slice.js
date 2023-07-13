import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  fetchInventory,
  fetchMyHistory,
  fetchMyInventory,
  fetchAllHistory,
  fetchAllUsers,
  postUserTakeInventory,
  postUserReturnInventory,
  fetchCheckDates,
  fetchInventoryBalanceForToday,
} from './thunks';

const initialState = {
  inventory: [],
  myHistory: [],
  myInventory: [],
  allHistory: [],
  allUsers: [],
  checkDates: [],
  reservedFromUntil: [],
  takeCartItems: [],
  returnCartItems: [],
  todaysBalance: [],
  status: 'idle',
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearStates: (state) => {
      return initialState;
    },
    checkDates: (state, action) => {
      state.checkDates = [...action.payload];
    },
    deleteInventoryItem: (state, action) => {
      state.inventory = state.inventory.filter(
        (item) => item.id !== action.payload
      );
    },
    updateCartItemCount: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        if (item.count > action.payload.count) {
          item.count = action.payload.count;
          return;
        }
      }
    },
    incrementTakeItemCount: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.count += 1;
      } else {
        state.takeCartItems.push({ ...action.payload, count: 1 });
      }
    },
    decrementTakeItemCount: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.count--;
        if (item.count === 0) {
          state.takeCartItems = state.takeCartItems.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
    },
    addItemPurpose: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.purpose = action.payload.purpose;
      }
    },
    addItemPurposeComment: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.purposeComment = action.payload.purposeComment || '';
      }
    },
    setTakeCartItemDateFromTo: (state, action) => {
      const item = state.takeCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.productId = action.payload.productId;
        item.reservedFrom = action.payload.reservedFrom;
        item.reservedUntil = action.payload.reservedUntil;
        item.isTaken = action.payload.isTaken;
        item.isReserved = action.payload.isReserved;
      }
    },
    resetTakeCartItems: (state) => {
      state.takeCartItems = [];
    },
    incrementReturnItemCount: (state, action) => {
      const item = state.returnCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.count += 1;
      } else {
        state.returnCartItems.push({ ...action.payload, count: 1 });
      }
    },
    decrementReturnItemCount: (state, action) => {
      const item = state.returnCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.count--;
        if (item.count === 0) {
          state.returnCartItems = state.returnCartItems.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
    },
    addReturnCartItemComment: (state, action) => {
      const item = state.returnCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.comment = action.payload.comment || '';
      }
    },
    addReturnCartItemStatus: (state, action) => {
      const item = state.returnCartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.status = action.payload.status;
      }
    },
    resetReturnCartItems: (state) => {
      state.returnCartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchMyHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myHistory = action.payload;
      })
      .addCase(fetchMyHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchMyInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.myInventory = action.payload;
      })
      .addCase(fetchMyInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchAllHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allHistory = action.payload;
      })
      .addCase(fetchAllHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(postUserTakeInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postUserTakeInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(postUserTakeInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(postUserReturnInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postUserReturnInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(postUserReturnInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchCheckDates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCheckDates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservedFromUntil = action.payload;
      })
      .addCase(fetchCheckDates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(fetchInventoryBalanceForToday.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventoryBalanceForToday.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todaysBalance = action.payload;
      })
      .addCase(fetchInventoryBalanceForToday.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder.addCase(PURGE, (state) => {
      storage.removeItem('persist:inventory');
      return initialState;
    });
  },
});

export const {
  clearStates,
  updateCartItemCount,
  checkDates,
  setTakeCartItemDateFromTo,
  deleteInventoryItem,
  incrementTakeItemCount,
  decrementTakeItemCount,
  addItemPurpose,
  addItemPurposeComment,
  resetTakeCartItems,
  incrementReturnItemCount,
  decrementReturnItemCount,
  resetReturnCartItems,
  addReturnCartItemComment,
  addReturnCartItemStatus,
} = inventorySlice.actions;
export default inventorySlice;
