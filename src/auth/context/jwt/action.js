'use client';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }, router) => {
  try {
    const params = { username, password };

    const res = await axiosInstance.post(endpoints.auth.signIn, params);
    // const userInfoLogin = await axios.post(endpoints.auth.userInfo, params);
    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    // Store the token in session storage
    await sessionStorage.setItem(STORAGE_KEY, token);

    // Set the session for axios
    await setSession(token);

    const userInfo = await axiosInstance.get(endpoints.user.info);
    // Store user data in session storage for persistence
    if (userInfo) {
      sessionStorage.setItem('user_data', JSON.stringify(userInfo.data));
    }
    if (userInfo.status === 200) {
      console.log('userInfo', userInfo.data.username);
      if (userInfo.data.username === 'entryteam' || userInfo.data.username === 'fulladmin') {
        return router.push('/dashboard');
      }
      if (userInfo.data.username === 'formadmin') return router.push('/plp-docs');
      return router.push('/admin');
    }

    return { token, userInfo };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error.message;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axiosInstance.post(endpoints.auth.signUp, params);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, access_token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
    // Clear user data from session storage
    sessionStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
