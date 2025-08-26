import * as z from 'zod';
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

// Custom Components
import { LocaleSelector } from 'src/components/locale-selector';

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
  newImagesArr: z.array(z.any()).optional(),
  deletedImagesArr: z.array(z.any()).optional(),
  typesArr: z.union([z.array(z.number()), z.number()]).optional(),
  houseTypesArr: z.union([z.array(z.number()), z.number()]).optional(),
});

export function PropertyNewEditForm({
  currentProperty,
  options,
  locale: initialLocale = 'en',
  onLocaleChange,
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [locale, setLocale] = useState(initialLocale);

  // SWR key for properties list
  const propertiesKey = `${API_BASE_URL}/dashboard/create/${locale}`;

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
      newImagesArr: [],
      deletedImagesArr: [],
    }),
    [currentProperty]
  );

  // Form methods and validation
  const methods = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues,
    mode: 'onChange', // Enable real-time validation
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

  const isMultiValue = watch('isMulti') === 1;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Format the data for API submission
      const formattedData = {
        title: data.title,
        price: data.priceMin, // BUG FIX 1: Set price from priceMin
        priceMax: data.priceMax ? data.priceMax : null,
        priceMin: data.priceMin,
        location: data.location,
        area: data.area,
        baths: data.baths,
        beds: data.beds,
        sqt: data.sqt,
        distToShop: data.distToShop,
        distToAirport: data.distToAirport,
        distToHospital: data.distToHospital,
        typesArr: Array.isArray(data.typesArr) ? data.typesArr : [data.typesArr],
        details: data.details,
        tagsArr: data.tagsArr || [],
        featuresArr: data.featuresArr || [],
        locationMap: data.locationMap,
        moneyType: data.moneyType,
        buildingFloor: data.buildingFloor,
        ageOfTheBuilding: data.ageOfTheBuilding,
        furnishedSale: data.furnishedSale ? 1 : 0,
        distToSea: data.distToSea,
        landscapesArr: data.landscapesArr || [],
        heatingTypesArr: data.heatingTypesArr || [],
        houseTypesArr: Array.isArray(data.houseTypesArr)
          ? data.houseTypesArr
          : [data.houseTypesArr],
        distToShopType: data.distToShopType,
        distToAirportType: data.distToAirportType,
        distToHospitalType: data.distToHospitalType,
        distToSeaType: data.distToSeaType,
        downloadsArr: data.downloadsArr,
        isMulti: data.isMulti,
        maxBath: data.maxBath,
        maxBed: data.maxBeds,
        maxSqt: data.maxSqt,
        maxFloor: data.maxFloor,
      };

      // Determine if this is a create or update operation
      const isEdit = !!currentProperty;
      const url = isEdit
        ? `${API_BASE_URL}/dashboard/update/${currentProperty.id}/${locale}`
        : `${API_BASE_URL}/dashboard/create/${locale}`;

      const token = sessionStorage.getItem(STORAGE_KEY);

      if (isEdit) {
        formattedData.newImagesArr = data.imagesArr.filter((img) => img.image);
        formattedData.deletedImagesArr = data.deletedImagesArr;
        delete formattedData.imagesArr;
      } else {
        formattedData.imagesArr = data.imagesArr;
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

      setTimeout(() => {
        router.push('/dashboard/properties');
      }, 1500);
    } catch (error) {
      console.error('Error saving property:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>
          {currentProperty ? 'Edit Property' : 'Add New Property'}
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Property saved successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isMultiValue}
                      onChange={(e) => setValue('isMulti', e.target.checked ? 1 : 0)}
                      disabled={!!currentProperty}
                    />
                  }
                  label="Is this a project (multiple units)?"
                />
                <LocaleSelector
                  value={locale}
                  onChange={(newLocale) => {
                    setLocale(newLocale);
                    onLocaleChange?.(newLocale);
                  }}
                  sx={{ minWidth: 150 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <PropertyNewEditDetails
                isMulti={isMultiValue}
                options={options}
                currentProperty={currentProperty}
              />
              <PropertyNewEditMedia />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <PropertyNewEditFeatures options={options} />
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 5, mb: 5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => handleNavigation('/dashboard/properties')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
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

      <Dialog open={showUnsavedDialog} onClose={cancelNavigation}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            {pendingNavigation === 'reset'
              ? 'You have unsaved changes. Are you sure you want to reset the form?'
              : 'You have unsaved changes. Are you sure you want to leave?'}
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
            {pendingNavigation === 'reset' ? 'Reset Form' : 'Leave'}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
