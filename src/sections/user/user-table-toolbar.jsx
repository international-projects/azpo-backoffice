'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: false, label: 'Active' },
  { value: true, label: 'Disabled' },
];

// ----------------------------------------------------------------------

export function UserTableToolbar({
  filters,
  onFilters,
  roleOptions,
  statusOptions,
  onResetFilters,
}) {
  const router = useRouter();

  const handleFilterName = (event) => {
    onFilters('name', event.target.value);
  };

  const handleFilterRole = (event) => {
    onFilters('role', event.target.value);
  };

  const handleFilterStatus = (event) => {
    onFilters('status', event.target.value);
  };

  const handleCreateUser = () => {
    router.push(paths.dashboard.user.new);
  };

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl
          fullWidth
          sx={{
            minWidth: { md: 240 },
          }}
        >
          <InputLabel>Role</InputLabel>

          <OutlinedInput
            value={filters.role}
            onChange={handleFilterRole}
            inputProps={{ MenuProps: { MenuListProps: { sx: { maxHeight: 220 } } } }}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </OutlinedInput>
        </FormControl>

        <FormControl
          fullWidth
          sx={{
            minWidth: { md: 240 },
          }}
        >
          <InputLabel>Status</InputLabel>

          <OutlinedInput
            value={filters.status}
            onChange={handleFilterStatus}
            inputProps={{ MenuProps: { MenuListProps: { sx: { maxHeight: 220 } } } }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </OutlinedInput>
        </FormControl>
      </Stack>

      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={handleCreateUser}
      >
        New User
      </Button>
    </Stack>
  );
} 