import 'react-quill/dist/quill.snow.css';

import useSWR from 'swr';
import ReactQuill from 'react-quill';
import { Icon } from '@iconify/react';
import { useRef, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// MUI Components
import {
  Card,
  Grid,
  Stack,
  Select,
  Switch,
  MenuItem,
  Checkbox,
  TextField,
  CardHeader,
  InputLabel,
  CardContent,
  FormControl,
  ToggleButton,
  ListItemText,
  OutlinedInput,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';
const fetcher = (url) => fetch(url).then((res) => res.json());

// Hook to fetch areas based on locationId
function useAreas(locationId) {
  const locale = 'en';
  const url = locationId ? `${API_BASE_URL}/real-estates/areas/${locationId}/${locale}` : null;
  const { data, error } = useSWR(url, fetcher);
  return {
    areas: data || [],
    isLoading: !error && !data && !!locationId,
  };
}

export function PropertyNewEditDetails({ isMulti, options, currentProperty }) {
  const { control, watch, setValue } = useFormContext();
  const { locs, types, typeHouses } = options;

  const locationValue = watch('location');

  const selectedLocation = locs.find((loc) => loc.location_key === locationValue);
  const { areas, isLoading: isLoadingAreas } = useAreas(selectedLocation?.id);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (locationValue) {
      setValue('area', '');
    }
  }, [locationValue, setValue]);
  // if edit mode, set area to the area of the property
  useEffect(() => {
    if (currentProperty) {
      setValue('area', currentProperty.area);
    }
  }, [currentProperty, setValue]);

  return (
    <Card>
      <CardHeader title="Property Details" />
      <CardContent>
        <Stack spacing={3}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Property Title"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Grid container spacing={2}>
            {/* Price */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="priceMin"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label={isMulti ? 'Min Price' : 'Price'}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="priceMax"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Price" fullWidth />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name="moneyType"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup {...field} exclusive color="primary" fullWidth>
                    <ToggleButton value="dollar">
                      <Icon icon="mdi:currency-usd" />
                    </ToggleButton>
                    <ToggleButton value="euro">
                      <Icon icon="mdi:currency-eur" />
                    </ToggleButton>
                    <ToggleButton value="ruble">
                      <Icon icon="mdi:currency-rub" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>

            {/* Location & Area */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    select
                    label="Location"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  >
                    {locs.map((opt) => (
                      <MenuItem key={opt.id} value={opt.location_key}>
                        {opt.location_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="area"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    select
                    label="Area"
                    fullWidth
                    disabled={!locationValue || isLoadingAreas}
                    error={!!error}
                    helperText={error?.message}
                  >
                    {areas.map((opt) => (
                      <MenuItem key={opt.id} value={opt.area_key}>
                        {opt.area_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Baths */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="baths"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Bathrooms"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxBath"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Bathrooms" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* Beds */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="beds"
                control={control}
                render={({ field, fieldState: { error } }) =>
                  isMulti ? (
                    <TextField
                      {...field}
                      type="number"
                      label="Bedrooms"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  ) : (
                    <TextField
                      {...field}
                      select
                      label="Bedrooms"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    >
                      {['1', '2', '3', '4', '5', '+5'].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>
                  )
                }
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxBeds"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Bedrooms" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* SQT */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="sqt"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Area (sqm)"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxSqt"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Area (sqm)" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* Floor */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="buildingFloor"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Floor"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxFloor"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Floor" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* Age of Building */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="ageOfTheBuilding"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Age of Building"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Furnished */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="furnishedSale"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value === 1}
                        onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                      />
                    }
                    label="Furnished"
                  />
                )}
              />
            </Grid>

            {/* Distances */}
            {['Shop', 'Airport', 'Hospital', 'Sea'].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Controller
                  name={`distTo${item}`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={`Distance to ${item}`}
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        endAdornment: (
                          <Controller
                            name={`distTo${item}Type`}
                            control={control}
                            render={({ field: typeField }) => (
                              <ToggleButtonGroup {...typeField} exclusive size="small">
                                <ToggleButton value="m">m</ToggleButton>
                                <ToggleButton value="km">km</ToggleButton>
                              </ToggleButtonGroup>
                            )}
                          />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            ))}

            {/* Map Link */}
            <Grid item xs={12}>
              <Controller
                name="locationMap"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Google Maps Link"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Types & Units */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="typesArr"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const safeValue = isMulti
                    ? Array.isArray(field.value)
                      ? field.value
                      : []
                    : field.value || '';
                  return (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        {...field}
                        value={safeValue}
                        multiple={isMulti}
                        input={<OutlinedInput label="Property Type" />}
                        renderValue={(selected) =>
                          types
                            .filter((t) =>
                              (Array.isArray(selected) ? selected : [selected]).includes(t.id)
                            )
                            .map((t) => t.name)
                            .join(', ')
                        }
                      >
                        {types.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            <Checkbox
                              checked={
                                Array.isArray(safeValue)
                                  ? safeValue.includes(opt.id)
                                  : safeValue === opt.id
                              }
                            />{' '}
                            <ListItemText primary={opt.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="houseTypesArr"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const safeValue = isMulti
                    ? Array.isArray(field.value)
                      ? field.value
                      : []
                    : field.value || '';
                  return (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Unit Type</InputLabel>
                      <Select
                        {...field}
                        value={safeValue}
                        multiple={isMulti}
                        input={<OutlinedInput label="Unit Type" />}
                        renderValue={(selected) =>
                          typeHouses
                            .filter((t) =>
                              (Array.isArray(selected) ? selected : [selected]).includes(t.id)
                            )
                            .map((t) => t.name)
                            .join(', ')
                        }
                      >
                        {typeHouses.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            <Checkbox
                              checked={
                                Array.isArray(safeValue)
                                  ? safeValue.includes(opt.id)
                                  : safeValue === opt.id
                              }
                            />{' '}
                            <ListItemText primary={opt.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }}
              />
            </Grid>
          </Grid>

          <Controller
            name="details"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write a detailed description..."
              />
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
