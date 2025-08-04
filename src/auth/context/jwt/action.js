'use client';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { access_token, user } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    // Store the token in session storage
    sessionStorage.setItem(STORAGE_KEY, access_token);

    // Set the session for axios
    setSession(access_token);

    // Store user data in session storage for persistence
    if (user) {
      sessionStorage.setItem('user_data', JSON.stringify(user));
    }

    return { access_token, user };
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
    const res = await axios.post(endpoints.auth.signUp, params);

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
