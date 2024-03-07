
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Import the storage engine

// Your rootReducer and initial state setup
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage, // Use the imported storage engine here
  // Other configuration options if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };

