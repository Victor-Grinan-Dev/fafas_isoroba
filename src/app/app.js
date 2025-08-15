import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';

export default configureStore({
    //next line prevent error on: react_devtools_backend.js:4026 A non-serializable value was detected in an action, in the path: `payload`. Value: {object...}
    middleware: getDefaultMiddleware =>getDefaultMiddleware({ serializableCheck: false}), 
  reducer: {
    app: appSlice,
  },
});