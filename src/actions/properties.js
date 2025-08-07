import axios from 'src/utils/axios';

// Mock data for testing
const mockProperties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    location: 'Downtown, City Center',
    type: 'SALE',
    price: 250000,
    money_type: 'USD',
    area: 120,
    metrage: 'sqm',
    bed_room: 2,
    bathroom: 1,
    is_multi: false,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    location: 'Suburban Area, Hills',
    type: 'RENT',
    price: 3500,
    money_type: 'USD',
    area: 250,
    metrage: 'sqm',
    bed_room: 4,
    bathroom: 3,
    is_multi: true,
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400'],
    createdAt: '2024-01-10T14:20:00Z',
  },
  {
    id: 3,
    title: 'Cozy Studio in University District',
    location: 'University District',
    type: 'BOTH',
    price: 180000,
    money_type: 'USD',
    area: 45,
    metrage: 'sqm',
    bed_room: 1,
    bathroom: 1,
    is_multi: false,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    createdAt: '2024-01-05T09:15:00Z',
  },
  {
    id: 4,
    title: 'Family House with Garden',
    location: 'Residential Area',
    type: 'SALE',
    price: 450000,
    money_type: 'USD',
    area: 180,
    metrage: 'sqm',
    bed_room: 3,
    bathroom: 2,
    is_multi: false,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    createdAt: '2024-01-20T16:45:00Z',
  },
  {
    id: 5,
    title: 'Penthouse with City View',
    location: 'Business District',
    type: 'RENT',
    price: 5000,
    money_type: 'USD',
    area: 200,
    metrage: 'sqm',
    bed_room: 3,
    bathroom: 2,
    is_multi: true,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    createdAt: '2024-01-12T11:30:00Z',
  },
];

// ----------------------------------------------------------------------

export const useGetProperties = (options = {}) => {
  const {
    page = 1,
    limit = 5,
    sort = 'title',
    order = 'asc',
    filter = '',
    searchFields = ['title', 'location', 'type', 'area'],
  } = options;

  // For now, return mock data
  // In production, you would use the actual API call
  const mockResponse = {
    data: mockProperties,
    loading: false,
    error: null,
    pagination: {
      totalData: mockProperties.length,
      pageCount: Math.ceil(mockProperties.length / limit),
      currentPage: page,
      limit,
    },
    refetch: () => Promise.resolve(mockProperties),
  };

  return {
    properties: mockResponse.data || [],
    propertiesLoading: mockResponse.loading,
    propertiesError: mockResponse.error,
    pagination: mockResponse.pagination || {},
    refetchProperties: mockResponse.refetch,
  };
};

// ----------------------------------------------------------------------

export const deleteProperty = async (id) => {
  // Mock delete - in production, this would be an API call
  console.log('Deleting property with ID:', id);
  return { success: true };
};

// ----------------------------------------------------------------------

export const getProperty = async (id) => {
  const response = await axios.get(`/api/properties/${id}`);
  return response.data;
};

// ----------------------------------------------------------------------

export const createProperty = async (data) => {
  const response = await axios.post('/api/properties', data);
  return response.data;
};

// ----------------------------------------------------------------------

export const updateProperty = async (id, data) => {
  const response = await axios.put(`/api/properties/${id}`, data);
  return response.data;
};
