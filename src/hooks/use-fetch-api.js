import { useState, useCallback } from 'react';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useFetchAPI = (endpoint, options = {}) => {
  const {
    page = 1,
    limit = 5,
    sort = 'name',
    order = 'asc',
    filter = '',
    searchFields = [],
    lang,
    populate = [],
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    pageCount: 0,
    totalData: 0,
    pageSize: 0,
  });

  const fetchData = useCallback(
    async (fetchOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: fetchOptions.page || page,
          limit: fetchOptions.limit || limit,
          sort: fetchOptions.sort || sort,
          order: fetchOptions.order || order,
          filter: fetchOptions.filter || filter,
          ...(fetchOptions.searchFields && { searchFields: fetchOptions.searchFields }),
          ...(fetchOptions.lang && { lang: fetchOptions.lang }),
          ...(fetchOptions.populate && { populate: fetchOptions.populate }),
        };

        const response = await axios.get(endpoint, { params });

        if (response.data) {
          setData(response.data.data || []);
          setPagination({
            page: response.data.page || params.page,
            limit: response.data.pageSize || params.limit,
            pageCount: response.data.pageCount || 0,
            totalData: response.data.totalData || 0,
            pageSize: response.data.pageSize || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, page, limit, sort, order, filter]
  );

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
  };
};
