// /app/dashboard/properties/page.tsx

/**
 * =================================================================================================
 * NEXT.JS PAGE & COMPONENT STRUCTURE (MINIMALS UI REFACTOR)
 * =================================================================================================
 *
 * This file has been completely refactored to align with the project's dependencies
 * (`@mui/material`, `swr`, `@iconify/react`).
 *
 * 1.  usePopover (Custom Hook):
 * - A simple hook to manage the state for the MUI Popover component.
 *
 * 2.  CustomPopover (Component):
 * - A wrapper around MUI's Popover to include the arrow styling from the Minimals UI theme.
 *
 * 3.  useProperties (SWR Hook):
 * - A custom hook that encapsulates SWR logic for fetching properties.
 *
 * 4.  PropertiesListViewTwo (Component):
 * - This is a Client Component that orchestrates the entire page.
 *
 * 5.  PropertyCard (Component):
 * - Redesigned to match the "Minimals UI" aesthetic with a multi-image layout and action popover.
 *
 * 6.  DeleteConfirmationDialog (Component):
 * - A robust confirmation modal for the delete action.
 *
 */

'use client';

// SWR for Data Fetching
import useSWR from 'swr';
import PropTypes from 'prop-types';
// Iconify for Icons
import { Icon } from '@iconify/react';
// Core Imports
import { useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Material-UI Components
import {
  Box,
  Grid,
  Button,
  Dialog,
  Popover,
  Container,
  TextField,
  Typography,
  IconButton,
  Pagination,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

import PropertyCard from '../property-card';

// Environment Variables
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/images/';

// ================================================================================================
// 1. POPOVER HOOK & COMPONENT (from Minimals UI sample)
// ================================================================================================
function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null);
  const onOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = Boolean(anchorEl);
  return { open, anchorEl, onOpen, onClose };
}

function CustomPopover({ open, anchorEl, onClose, children, sx, ...other }) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 160,
          ...sx,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}

CustomPopover.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.node,
  sx: PropTypes.object,
};

// ================================================================================================
// 2. SWR DATA FETCHER & HOOK
// ================================================================================================
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
  });

function useProperties() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const propId = searchParams.get('propId');

  const query = new URLSearchParams({ page });
  if (propId) {
    query.set('propertyId', propId);
  }

  const url = `${API_BASE_URL}/dashboard/properties/en?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    properties: data?.properties,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}

// ================================================================================================
// 3. MAIN PAGE COMPONENT (CLIENT COMPONENT)
// ================================================================================================
export function PropertiesListViewTwo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, count, isLoading, isError, mutate } = useProperties();

  const [searchId, setSearchId] = useState(searchParams.get('propId') || '');
  const [dialogState, setDialogState] = useState({ open: false, propId: null });

  const totalPages = useMemo(() => (count ? Math.ceil(count / 15) : 0), [count]);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearchSubmit = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (searchId) {
      current.set('propId', searchId);
    } else {
      current.delete('propId');
    }
    current.set('page', '1');
    router.push(`/dashboard/properties?${current.toString()}`);
  };

  const handlePaginationChange = (event, value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', value.toString());
    router.push(`/dashboard/properties?${current.toString()}`);
  };

  const handleEdit = useCallback(
    (id) => {
      router.push(`/update-property/${id}`);
    },
    [router]
  );

  const openDeleteDialog = (id) => {
    setDialogState({ open: true, propId: id });
  };

  const closeDeleteDialog = () => {
    setDialogState({ open: false, propId: null });
  };

  const handleDeleteProperty = async () => {
    if (!dialogState.propId) return;
    try {
      await fetch(`${API_BASE_URL}/dashboard/property/delete/${dialogState.propId}`, {
        method: 'DELETE',
      });
      closeDeleteDialog();
      mutate();
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:plus" />}
          onClick={() => router.push('/add-property')}
        >
          Add Property
        </Button>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by ID"
            value={searchId}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          <IconButton color="primary" onClick={handleSearchSubmit}>
            <Icon icon="mdi:magnify" />
          </IconButton>
        </Box>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" my={10}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" textAlign="center">
          Failed to load properties.
        </Typography>
      )}

      {!isLoading && !isError && (
        <>
          {properties && properties.length > 0 ? (
            <Grid container spacing={3}>
              {properties.map((prop) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={prop.id}>
                  <PropertyCard
                    property={prop}
                    onEdit={() => handleEdit(prop.id)}
                    onDelete={() => openDeleteDialog(prop.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography textAlign="center" my={10}>
              No properties found.
            </Typography>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={5}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePaginationChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <DeleteConfirmationDialog
        open={dialogState.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProperty}
      />
    </Container>
  );
}

// ================================================================================================
// 5. DELETE CONFIRMATION DIALOG (MUI)
// ================================================================================================
function DeleteConfirmationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Property</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this property? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
