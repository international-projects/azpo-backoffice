'use client';

import { Box, Select, MenuItem, InputLabel, Typography, FormControl } from '@mui/material';

import { FlagIcon } from './iconify';

// ----------------------------------------------------------------------

const LANGUAGES = [
  { value: 'en', label: 'English', countryCode: 'GB' },
  { value: 'ru', label: 'Russian', countryCode: 'RU' },
];

// ----------------------------------------------------------------------

export function LocaleSelector({ value, onChange, sx, ...other }) {
  return (
    <FormControl sx={{ minWidth: 120, ...sx }} size="small" {...other}>
      <InputLabel>Language</InputLabel>
      <Select value={value} label="Language" onChange={(e) => onChange(e.target.value)}>
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang.value} value={lang.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon code={lang.countryCode} />
              <Typography>{lang.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export { LANGUAGES };
