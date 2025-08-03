import { useFetchAPI } from 'src/hooks/use-fetch-api';

import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useGetUsers = (options = {}) => {
  const {
    page = 1,
    limit = 5,
    sort = 'name',
    order = 'asc',
    filter = '',
    searchFields = ['name', 'email', 'firstName', 'lastName'],
  } = options;

  const {
    data: users,
    loading,
    error,
    pagination,
    refetch,
  } = useFetchAPI(endpoints.user.list, {
    page,
    limit,
    sort,
    order,
    filter,
    searchFields,
  });

  return {
    users,
    usersLoading: loading,
    usersError: error,
    refetchUsers: refetch,
    pagination,
  };
};

// ----------------------------------------------------------------------

export const createUser = async (userData) => {
  try {
    // Ensure disabled field is included
    const submitData = {
      ...userData,
      disabled: userData.disabled || false,
    };
    const response = await axios.post(endpoints.user.create, submitData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const updateUser = async (userId, userData) => {
  try {
    // Ensure disabled field is included
    const submitData = {
      ...userData,
      disabled: userData.disabled || false,
    };
    const response = await axios.put(`${endpoints.user.update}/${userId}`, submitData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${endpoints.user.delete}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${endpoints.user.details}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
