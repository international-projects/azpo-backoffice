import { Controller, useFormContext } from 'react-hook-form';

// MUI Components
import {
  Card,
  Grid,
  Stack,
  Checkbox,
  FormGroup,
  CardHeader,
  CardContent,
  FormControlLabel,
} from '@mui/material';

const FeatureSection = ({ title, options, fieldName }) => {
  const { control } = useFormContext();
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <FormGroup>
          <Grid container spacing={1}>
            {options &&
              options.map((option) => (
                <Grid item xs={12} sm={6} key={option.id}>
                  <FormControlLabel
                    control={
                      <Controller
                        name={`${fieldName}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value.includes(option.id)}
                            onChange={() => {
                              const newValue = field.value.includes(option.id)
                                ? field.value.filter((id) => id !== option.id)
                                : [...field.value, option.id];
                              field.onChange(newValue);
                            }}
                          />
                        )}
                      />
                    }
                    label={option.name}
                  />
                </Grid>
              ))}
          </Grid>
        </FormGroup>
      </CardContent>
    </Card>
  );
};

export function PropertyNewEditFeatures({ options }) {
  const { tags, features, heating, landscapesData } = options;

  return (
    <Stack spacing={3}>
      <FeatureSection title="Tags" options={tags} fieldName="tagsArr" />
      <FeatureSection title="Features" options={features} fieldName="featuresArr" />
      <FeatureSection title="Heating Types" options={heating} fieldName="heatingTypesArr" />
      <FeatureSection title="Landscapes" options={landscapesData} fieldName="landscapesArr" />
    </Stack>
  );
}
