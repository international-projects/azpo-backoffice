import { useFetchAPI } from 'src/hooks/use-fetch-api';

import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useGetCategories = (options = {}) => {
  const {
    page = 1,
    limit = 5,
    sort = 'title',
    order = 'asc',
    filter = '',
    searchFields = ['title', 'sub_title'],
    lang,
  } = options;

  const {
    data: categories,
    loading,
    error,
    pagination,
    refetch,
  } = useFetchAPI(endpoints.categories.list, {
    page,
    limit,
    sort,
    order,
    filter,
    searchFields,
    lang,
  });

  return {
    categories,
    categoriesLoading: loading,
    categoriesError: error,
    refetchCategories: refetch,
    pagination,
  };
};

// ----------------------------------------------------------------------

export const getCategories = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.categories.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.categories.details(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.categories.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(endpoints.categories.update(id), data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(endpoints.categories.delete(id));
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
