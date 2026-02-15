import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentReducer from '../features/student/studentSlice';
import masterReducer from '../features/master/masterSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import employeeReducer from '../features/employee/employeeSlice';
import userRightsReducer from '../features/userRights/userRightsSlice';
import attendanceReducer from '../features/transaction/attendanceSlice';
import branchReducer from '../features/master/branchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    master: masterReducer,
    transaction: transactionReducer,
    attendance: attendanceReducer,
    employees: employeeReducer,
    userRights: userRightsReducer,
    branch: branchReducer,
  },
});