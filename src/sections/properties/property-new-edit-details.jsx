import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
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

// This is a mock function, replace with your actual API call
const fetchAreasForLocation = async (locationKey) => {
  // In a real app, you would fetch this from your API
  // e.g., const response = await fetch(`/api/areas?location=${locationKey}`);
  console.log(`Fetching areas for ${locationKey}`);
  const mockData = {
    istanbul: [
      { id: 1, area_key: 'kadikoy', area_name: 'Kadikoy' },
      { id: 2, area_key: 'besiktas', area_name: 'Besiktas' },
    ],
    antalya: [
      { id: 3, area_key: 'konyaalti', area_name: 'Konyaalti' },
      { id: 4, area_key: 'muratpasa', area_name: 'Muratpasa' },
    ],
    alanya: [{ id: 5, area_key: 'mahmutlar', area_name: 'Mahmutlar' }],
    mersin: [{ id: 6, area_key: 'mezitli', area_name: 'Mezitli' }],
  };
  return mockData[locationKey] || [];
};

export function PropertyNewEditDetails({ isMulti, options }) {
  const { control, watch, setValue } = useFormContext();
  const { locs, types, typeHouses } = options;

  const [areaList, setAreaList] = useState([]);
  const locationValue = watch('locationValue');

  useEffect(() => {
    if (locationValue) {
      fetchAreasForLocation(locationValue).then((data) => {
        setAreaList(data);
        // Reset area if the new location doesn't have the currently selected area
        if (data.length > 0 && !data.some((area) => area.area_key === watch('areaValue'))) {
          setValue('areaValue', '');
        }
      });
    } else {
      setAreaList([]);
    }
  }, [locationValue, setValue, watch]);

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
                name="minPrice"
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
                  name="maxPrice"
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
                name="locationValue"
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
                name="areaValue"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    select
                    label="Area"
                    fullWidth
                    disabled={!locationValue || areaList.length === 0}
                    error={!!error}
                    helperText={error?.message}
                  >
                    {areaList.map((opt) => (
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
                  name="maxBaths"
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
                name="floor"
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
                name="ageOfBuilding"
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
                name="furnished"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Furnished"
                  />
                )}
              />
            </Grid>

            {/* Distances */}
            {['Shop', 'Airport', 'Hospital', 'Sea'].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Controller
                  name={`dist${item}`}
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
                            name={`${item.toLowerCase()}Type`}
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
                name="mapLink"
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
                name="typeValue"
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
                name="typeUnit"
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
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                height={300}
                placeholder="Write a detailed description..."
              />
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
