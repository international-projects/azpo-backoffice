'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { createUser, updateUser, getUserById } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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

export function UserFormView({ isEdit = false, userId }) {
  const router = useRouter();
  const loading = useBoolean(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    phone: '',
    disabled: false,
    avatar: {
      url: '',
    },
  });

  const [errors, setErrors] = useState({});

  const loadUserData = useCallback(async () => {
    try {
      const userData = await getUserById(userId);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'USER',
        phone: userData.phone || '',
        disabled: userData.disabled || false,
        avatar: userData.avatar || { url: '' },
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      loading.onFalse();
    }
  }, [userId, loading]);
  useEffect(() => {
    if (isEdit && userId) {
      loadUserData();
    } else {
      loading.onFalse();
    }
  }, [isEdit, userId, loadUserData, loading]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = { ...formData };

      if (!submitData.password) {
        delete submitData.password;
      }

      if (isEdit) {
        await updateUser(userId, submitData);
        toast.success('User updated successfully!');
      } else {
        await createUser(submitData);
        toast.success('User created successfully!');
      }

      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (loading.value) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={isEdit ? 'Edit User' : 'Create User'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: isEdit ? 'Edit' : 'Create' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {isEdit ? 'Edit User Information' : 'Create New User'}
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />

              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Stack>

            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password || (isEdit ? 'Leave blank to keep current password' : '')}
              required={!isEdit}
            />

            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.disabled}
                  label="Status"
                  onChange={(e) => handleInputChange('disabled', e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              label="Avatar URL"
              value={
                typeof formData.avatar === 'string' ? formData.avatar : formData.avatar?.url || ''
              }
              onChange={(e) => handleInputChange('avatar', { url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                component={RouterLink}
                href={paths.dashboard.user.root}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="eva:save-fill" />}
              >
                {isEdit ? 'Update User' : 'Create User'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
