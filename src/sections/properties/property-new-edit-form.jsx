import * as z from 'zod';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

// MUI Components
import {
  Box,
  Grid,
  Stack,
  Alert,
  Button,
  Switch,
  Dialog,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { PropertyNewEditMedia } from './property-new-edit-media';
// Custom Components
import { PropertyNewEditDetails } from './property-new-edit-details';
import { PropertyNewEditFeatures } from './property-new-edit-features';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/api';

// Check if environment variable is set
if (!process.env.NEXT_PUBLIC_SERVER_URL) {
  console.warn(
    'NEXT_PUBLIC_SERVER_URL environment variable is not set. Using fallback URL:',
    API_BASE_URL
  );
}

// SWR Fetcher
const fetcher = (url, options = {}) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }).then(async (res) => {
    console.log('API Response Status:', res.status);
    console.log('API Response Headers:', res.headers);

    if (!res.ok) {
      // Try to get the response text to see what's being returned
      const responseText = await res.text();
      console.error('API Error Response Text:', responseText);

      // If it's HTML, it's likely a server error page
      if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
        throw new Error(
          `Server returned HTML error page (${res.status}). Check API endpoint and server status.`
        );
      }

      throw new Error(
        `HTTP error! status: ${res.status}, response: ${responseText.substring(0, 200)}`
      );
    }

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await res.text();
      console.error('Non-JSON Response:', responseText);
      throw new Error(`Expected JSON response but got: ${contentType || 'unknown'}`);
    }

    return res.json();
  });

// Validation Schema with Zod - Updated to match the expected field names
const PropertySchema = z.object({
  isMulti: z.number(),
  title: z.string().min(1, 'Title is required'),
  details: z.string().optional(),
  imagesArr: z.array(z.any()).optional(),
  downloadsArr: z.array(z.any()).optional(),
  baths: z.string().min(1, 'Required'),
  maxBath: z.string().optional(),
  beds: z.string().min(1, 'Required'),
  maxBeds: z.string().optional(),
  sqt: z.string().min(1, 'Required'),
  maxSqt: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  area: z.string().min(1, 'Area is required'),
  distToShop: z.string().min(1, 'Required'),
  distToShopType: z.string().nullable().optional(),
  distToAirport: z.string().min(1, 'Required'),
  distToAirportType: z.string().min(1, 'Required'),
  distToHospital: z.string().min(1, 'Required'),
  distToHospitalType: z.string().min(1, 'Required'),
  distToSea: z.string().min(1, 'Required'),
  distToSeaType: z.string().min(1, 'Required'),
  locationMap: z.string().min(1, 'Required'),
  buildingFloor: z.string().min(1, 'Required'),
  maxFloor: z.string().optional(),
  ageOfTheBuilding: z.string().min(1, 'Required'),
  price: z.string().min(1, 'Required'),
  priceMin: z.string().min(1, 'Required'),
  priceMax: z.string().nullable().optional(),
  moneyType: z.enum(['dollar', 'euro', 'ruble']).optional(),
  furnishedSale: z.union([z.number(), z.boolean()]).optional(),
  tagsArr: z.array(z.number()).optional(),
  featuresArr: z.array(z.number()).optional(),
  heatingTypesArr: z.array(z.number()).optional(),
  landscapesArr: z.array(z.number()).optional(),
  download: z.string().optional(),

  typesArr: z.union([z.array(z.number()), z.number()]).optional(),
  houseTypesArr: z.union([z.array(z.number()), z.number()]).optional(),
});

export function PropertyNewEditForm({ currentProperty, options }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // SWR key for properties list
  const propertiesKey = `${API_BASE_URL}/dashboard/create/en`;

  // Reset form state when switching between create/edit modes
  useEffect(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, [currentProperty?.id]);
  const defaultValues = useMemo(
    () => ({
      isMulti: currentProperty?.is_multi || 0,
      title: currentProperty?.title || '',
      details: currentProperty?.details || '',
      imagesArr: currentProperty?.images || [],
      downloadsArr: currentProperty?.dowloads || [],
      baths: currentProperty?.bathroom?.toString() || '1',
      maxBath: currentProperty?.max_bath?.toString() || '',
      beds: currentProperty?.bed_room || '',
      maxBeds: currentProperty?.max_bed?.toString() || '',
      sqt: currentProperty?.metrage?.toString() || '0',
      maxSqt: currentProperty?.max_sqt?.toString() || '',
      location: currentProperty?.location || '',
      area: currentProperty?.area || '',
      typesArr: currentProperty?.types?.map((t) => t.id) || [],
      houseTypesArr: currentProperty?.houseTypes?.map((ht) => ht.id) || [],
      distToShop: currentProperty?.dist_shopping?.toString() || '0',
      distToShopType: currentProperty?.dist_shopping_type || 'm',
      distToAirport: currentProperty?.dist_airport?.toString() || '0',
      distToAirportType: currentProperty?.dist_airport_type || 'km',
      distToHospital: currentProperty?.dist_hospital?.toString() || '0',
      distToHospitalType: currentProperty?.dist_hospital_type || 'm',
      distToSea: currentProperty?.dist_sea?.toString() || '0',
      distToSeaType: currentProperty?.dist_sea_type || 'm',
      locationMap: currentProperty?.location_map || '',
      buildingFloor: currentProperty?.building_floor?.toString() || '0',
      maxFloor: currentProperty?.max_floor?.toString() || '',
      ageOfTheBuilding: currentProperty?.age_of_the_building?.toString() || '0',
      price: currentProperty?.price_min?.toString() || '0',
      priceMin: currentProperty?.price_min?.toString() || '0',
      priceMax: currentProperty?.price_max?.toString() || '',
      moneyType: currentProperty?.money_type || 'dollar',
      furnishedSale: currentProperty?.furnished_sale || 0,
      tagsArr: currentProperty?.tags?.map((t) => t.id) || [],
      featuresArr: currentProperty?.features?.map((f) => f.id) || [],
      heatingTypesArr: currentProperty?.heatingTypes?.map((h) => h.id) || [],
      landscapesArr: currentProperty?.landscapes?.map((l) => l.id) || [],
      download: currentProperty?.download || '',
    }),
    [currentProperty]
  );

  // Form methods and validation
  const methods = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues,
    mode: 'onChange', // Enable real-time validation
  });

  console.log('Form methods initialized:', methods);
  console.log('Default values:', defaultValues);
  // Check for unsaved changes
  const hasUnsavedChanges = methods.formState.isDirty;

  // Handle browser navigation events
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !submitSuccess) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, submitSuccess]);

  // Handle navigation with unsaved changes
  const handleNavigation = (path) => {
    if (hasUnsavedChanges && !submitSuccess) {
      setPendingNavigation(path);
      setShowUnsavedDialog(true);
    } else {
      router.push(path);
    }
  };

  const confirmNavigation = () => {
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const cancelNavigation = () => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

  const handleReset = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
      setPendingNavigation('reset');
    } else {
      methods.reset(defaultValues);
    }
  };

  const confirmReset = () => {
    setShowUnsavedDialog(false);
    methods.reset(defaultValues);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const {
    handleSubmit,
    watch,
    setValue, // Destructure setValue from methods
    formState: { errors },
  } = methods;

  const isMultiValue = watch('isMulti') === 1;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log('Form submission started');
      console.log('Raw Form Data:', data);
      console.log('Form validation errors:', methods.formState.errors);
      console.log('Form is valid:', methods.formState.isValid);
      console.log('Form is dirty:', methods.formState.isDirty);
      console.log('Form is touched:', methods.formState.isTouched);

      // Validate that we have the required data
      if (!data.title || !data.location || !data.area) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Basic validation passed');
      // Format the data for API submission
      const formattedData = {
        ...data,
        typesArr: Array.isArray(data.typesArr) ? data.typesArr : [data.typesArr],
        houseTypesArr: Array.isArray(data.houseTypesArr)
          ? data.houseTypesArr
          : [data.houseTypesArr],
      };
      formattedData.price = '11111';

      console.log('Formatted Data for API:', formattedData);
      console.log('Furnished sale value:', data.furnishedSale, 'Type:', typeof data.furnishedSale);
      console.log('Formatted furnished_sale:', formattedData.furnished_sale);

      // Determine if this is a create or update operation
      const isEdit = !!currentProperty;
      const url = isEdit
        ? `${API_BASE_URL}/dashboard/update/${currentProperty.id}/en`
        : `${API_BASE_URL}/dashboard/create/en`;

      const method = isEdit ? 'PATCH' : 'POST';

      console.log('API Configuration:');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Environment variable:', process.env.NEXT_PUBLIC_SERVER_URL);
      console.log('Full URL:', url);
      console.log('Method:', method);
      console.log('Is Edit:', isEdit);

      // Make the API call
      console.log('Making API call to:', url);
      console.log('Method:', method);
      console.log('Formatted data:', formattedData);

      const token = sessionStorage.getItem(STORAGE_KEY);
      console.log(
        'Authentication Token:',
        token ? `${token.substring(0, 20)}...` : 'No token found'
      );

      // Check if URL is valid
      if (!url || url.includes('undefined') || url.includes('null')) {
        throw new Error(`Invalid API URL: ${url}`);
      }

      let response = null;
      // check is edit or create
      if (isEdit) {
        response = await axiosInstance.patch(url, formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axiosInstance.post(url, formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log('API Response:', response);

      // Optimistically update the properties list
      if (response.success) {
        // Invalidate and revalidate the properties list
        await mutate(propertiesKey);

        // If editing, also update the current property data
        if (isEdit) {
          await mutate(`${API_BASE_URL}/dashboard/properties/${currentProperty.id}`);
        }

        setSubmitSuccess(true);
        console.log('Property saved successfully!');

        // Reset form dirty state
        methods.reset(formattedData);

        // Redirect to properties list after a short delay
        setTimeout(() => {
          router.push('/dashboard/properties');
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    console.log('PropertyNewEditForm rendered');
    console.log('Form methods:', methods);
    console.log('Form values:', methods.getValues());
    console.log('Form errors:', methods.formState.errors);
    console.log('Form is valid:', methods.formState.isValid);
    console.log('Form is dirty:', methods.formState.isDirty);
    console.log('Current property:', currentProperty);
    console.log('Options:', options);
  }, [methods, currentProperty, options]);

  console.log('Rendering form with methods:', methods);
  console.log('Form state:', methods.formState);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>
          {currentProperty ? 'Edit Property' : 'Add New Property'}
        </Typography>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Property saved successfully! Redirecting...
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            console.log('Form onSubmit triggered');
            console.log('Event:', e);
            console.log('Form methods available:', !!methods);
            console.log('Form state before submit:', methods.formState);
            console.log('Form validation errors before submit:', methods.formState.errors);
            console.log('Form is valid before submit:', methods.formState.isValid);
            onSubmit(e);
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMultiValue}
                    onChange={(e) => setValue('isMulti', e.target.checked ? 1 : 0)} // Use setValue directly
                    disabled={!!currentProperty} // Disable if editing
                  />
                }
                label="Is this a project (multiple units)?"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <PropertyNewEditDetails isMulti={isMultiValue} options={options} />
              <PropertyNewEditMedia />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <PropertyNewEditFeatures options={options} />
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleNavigation('/dashboard/properties')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                console.log('Test button clicked');
                const formData = methods.getValues();
                console.log('Current form data:', formData);
                console.log('Form errors:', methods.formState.errors);
                console.log('Form is valid:', methods.formState.isValid);
                console.log('Form is dirty:', methods.formState.isDirty);
              }}
            >
              Debug Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              onClick={() => {
                console.log('Submit button clicked');
                console.log('Form state:', methods.formState);
                console.log('Form values:', methods.getValues());
                console.log('Form errors:', methods.formState.errors);
                console.log('Form is valid:', methods.formState.isValid);
                console.log('Form is dirty:', methods.formState.isDirty);
                console.log('Form is submitting:', isSubmitting);
                console.log('Form can submit:', methods.formState.isValid && !isSubmitting);
              }}
            >
              {isSubmitting
                ? currentProperty
                  ? 'Saving...'
                  : 'Creating...'
                : currentProperty
                  ? 'Save Changes'
                  : 'Create Property'}
            </Button>
          </Box>
        </form>
      </Container>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={showUnsavedDialog} onClose={cancelNavigation}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            {pendingNavigation === 'reset'
              ? 'You have unsaved changes. Are you sure you want to reset the form? All unsaved changes will be lost.'
              : 'You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelNavigation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={pendingNavigation === 'reset' ? confirmReset : confirmNavigation}
            color="error"
            variant="contained"
          >
            {pendingNavigation === 'reset' ? 'Reset Form' : 'Leave Without Saving'}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
