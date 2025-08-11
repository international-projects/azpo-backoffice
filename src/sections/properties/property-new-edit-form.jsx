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

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { PropertyNewEditMedia } from './property-new-edit-media';
// Custom Components
import { PropertyNewEditDetails } from './property-new-edit-details';
import { PropertyNewEditFeatures } from './property-new-edit-features';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';

// SWR Fetcher
const fetcher = (url, options = {}) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

// Validation Schema with Zod - Simplified for testing
const PropertySchema = z.object({
  isMulti: z.boolean(),
  title: z.string().min(1, 'Title is required'),
  details: z.string().optional(),
  // Temporarily make images optional for testing
  imagesArr: z.array(z.any()).optional(),
  downloads: z.array(z.any()).optional(),
  baths: z.coerce.number().min(1, 'Required'),
  maxBaths: z.coerce.number().optional(),
  beds: z.string().min(1, 'Required'),
  maxBeds: z.coerce.number().optional(),
  sqt: z.coerce.number().min(1, 'Required'),
  maxSqt: z.coerce.number().optional(),
  locationValue: z.string().min(1, 'Location is required'),
  areaValue: z.string().min(1, 'Area is required'),
  typeValue: z
    .union([z.array(z.number()), z.number()])
    .refine((val) => (Array.isArray(val) ? val.length > 0 : !!val), {
      message: 'Type is required',
    }),
  typeUnit: z
    .union([z.array(z.number()), z.number()])
    .refine((val) => (Array.isArray(val) ? val.length > 0 : !!val), {
      message: 'Unit type is required',
    }),
  distShop: z.coerce.number().min(1, 'Required'),
  shopType: z.string().min(1, 'Required'),
  distAirport: z.coerce.number().min(1, 'Required'),
  distToAirportType: z.string().min(1, 'Required'),
  distHospital: z.coerce.number().min(1, 'Required'),
  hospitalType: z.string().min(1, 'Required'),
  distSea: z.coerce.number().min(1, 'Required'),
  seaType: z.string().min(1, 'Required'),
  mapLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  floor: z.coerce.number().min(0, 'Required'),
  maxFloor: z.coerce.number().optional(),
  ageOfBuilding: z.coerce.number().min(0, 'Required'),
  minPrice: z.coerce.number().min(1, 'Required'),
  maxPrice: z.coerce.number().optional(),
  moneyType: z.enum(['dollar', 'euro', 'ruble']),
  furnished: z.boolean(),
  tags: z.array(z.number()).optional(),
  features: z.array(z.number()).optional(),
  heating: z.array(z.number()).optional(),
  landscapes: z.array(z.number()).optional(),
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
      isMulti: currentProperty?.is_multi === 1 || false,
      title: currentProperty?.title || '',
      details: currentProperty?.details || '',
      imagesArr: currentProperty?.images || [],
      downloads: currentProperty?.dowloads || [],
      baths: currentProperty?.bathroom || 1,
      maxBaths: currentProperty?.max_bath || undefined,
      beds: currentProperty?.bed_room || '',
      maxBeds: currentProperty?.max_bed || undefined,
      sqt: currentProperty?.metrage || 0,
      maxSqt: currentProperty?.max_sqt || undefined,
      locationValue: currentProperty?.location || '',
      areaValue: currentProperty?.area || '',
      typeValue: currentProperty?.is_multi
        ? currentProperty?.types?.map((t) => t.id) || []
        : currentProperty?.types?.[0]?.id || '',
      typeUnit: currentProperty?.is_multi
        ? currentProperty?.houseTypes?.map((ht) => ht.id) || []
        : currentProperty?.houseTypes?.[0]?.id || '',
      distShop: currentProperty?.dist_shopping || 0,
      shopType: currentProperty?.dist_shopping_type || 'm',
      distAirport: currentProperty?.dist_airport || 0,
      distToAirportType: currentProperty?.dist_airport_type || 'km',
      distHospital: currentProperty?.dist_hospital || 0,
      hospitalType: currentProperty?.dist_hospital_type || 'm',
      distSea: currentProperty?.dist_sea || 0,
      seaType: currentProperty?.dist_sea_type || 'm',
      mapLink: currentProperty?.location_map || '',
      floor: currentProperty?.building_floor || 0,
      maxFloor: currentProperty?.max_floor || undefined,
      ageOfBuilding: currentProperty?.age_of_the_building || 0,
      minPrice: currentProperty?.price_min || 0,
      maxPrice: currentProperty?.price_max || undefined,
      moneyType: currentProperty?.money_type || 'dollar',
      furnished: currentProperty?.furnished_sale === 1 || false,
      tags: currentProperty?.tags?.map((t) => t.id) || [],
      features: currentProperty?.features?.map((f) => f.id) || [],
      heating: currentProperty?.heatingTypes?.map((h) => h.id) || [],
      landscapes: currentProperty?.landscapes?.map((l) => l.id) || [],
    }),
    [currentProperty]
  );

  // Form methods and validation
  const methods = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues,
  });
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

  const isMultiValue = watch('isMulti');

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      console.log('Form submission started');
      console.log('Raw Form Data:', data);

      // Validate that we have the required data
      if (!data.title || !data.locationValue || !data.areaValue) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Basic validation passed');

      // Format the data for API submission
      const formattedData = {
        ...data,
        // Convert boolean values to integers if needed by your API
        is_multi: data.isMulti ? 1 : 0,
        furnished_sale: data.furnished ? 1 : 0,
        // Ensure arrays are properly formatted
        types: Array.isArray(data.typeValue) ? data.typeValue : [data.typeValue],
        houseTypes: Array.isArray(data.typeUnit) ? data.typeUnit : [data.typeUnit],
        // Convert string numbers to actual numbers where needed
        bathroom: Number(data.baths),
        max_bath: data.maxBaths ? Number(data.maxBaths) : null,
        bed_room: data.beds,
        max_bed: data.maxBeds ? Number(data.maxBeds) : null,
        metrage: Number(data.sqt),
        max_sqt: data.maxSqt ? Number(data.maxSqt) : null,
        // Distance fields
        dist_shopping: Number(data.distShop),
        dist_shopping_type: data.shopType,
        dist_airport: Number(data.distAirport),
        dist_airport_type: data.distToAirportType,
        dist_hospital: Number(data.distHospital),
        dist_hospital_type: data.hospitalType,
        dist_sea: Number(data.distSea),
        dist_sea_type: data.seaType,
        // Building details
        building_floor: Number(data.floor),
        max_floor: data.maxFloor ? Number(data.maxFloor) : null,
        // Pricing
        price_min: Number(data.minPrice),
        price_max: data.maxPrice ? Number(data.maxPrice) : null,
        // Arrays
        tags: data.tags || [],
        features: data.features || [],
        heatingTypes: data.heating || [],
        landscapes: data.landscapes || [],
      };

      console.log('Formatted Data for API:', formattedData);

      // Determine if this is a create or update operation
      const isEdit = !!currentProperty;
      const url = isEdit
        ? `${API_BASE_URL}/dashboard/update/${currentProperty.id}/en`
        : `${API_BASE_URL}/dashboard/create/en`;

      const method = isEdit ? 'PATCH' : 'POST';

      // Make the API call
      const response = await fetcher(url, {
        method,
        body: JSON.stringify(formattedData),
        // send token
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(STORAGE_KEY)}`,
        },
      });

      console.log('API Response:', response);

      // Optimistically update the properties list
      if (response.success) {
        // Invalidate and revalidate the properties list
        await mutate(propertiesKey);

        // If editing, also update the current property data
        if (isEdit) {
          await mutate(`${API_BASE_URL}/dashboard/update/${currentProperty.id}/en`);
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
    console.log('Current property:', currentProperty);
    console.log('Options:', options);
  }, [methods, currentProperty, options]);

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

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMultiValue}
                    onChange={(e) => setValue('isMulti', e.target.checked)} // Use setValue directly
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
            <Button type="submit" variant="contained" disabled={isSubmitting}>
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
