'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { deleteUser, useGetUsers } from 'src/actions/user';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserTableFiltersResult } from '../user-table-filters-result';
import {
  RenderCellUser,
  RenderCellRole,
  RenderCellPhone,
  RenderCellStatus,
  RenderCellCreatedAt,
} from '../user-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export function UserListView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [filters, setFilters] = useState({
    filter: '',
    sort: 'name',
    order: 'asc',
  });

  const { users, usersLoading, refetchUsers, pagination } = useGetUsers({
    searchFields: ['name', 'email', 'phone', 'role', 'firstName', 'lastName'],
  });

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const isInitialMount = useRef(true);

  // Refetch data when pagination or filters change
  useEffect(() => {
    let timeoutId;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      refetchUsers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: filters.sort,
        order: filters.order,
        filter: filters.filter,
        searchFields: ['name', 'email', 'phone', 'role', 'firstName', 'lastName'],
      });
    } else {
      timeoutId = setTimeout(() => {
        refetchUsers({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['name', 'email', 'phone', 'role', 'firstName', 'lastName'],
        });
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [paginationModel, filters, refetchUsers]);

  const canReset = filters.filter !== '' || filters.sort !== 'name' || filters.order !== 'asc';

  // Debug pagination info
  console.log('Pagination info:', {
    currentPage: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    totalData: pagination.totalData,
    pageCount: pagination.pageCount,
    usersCount: users.length,
    filters,
  });

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteUser(id);
        toast.success('Delete success!');
        // Refetch data after deletion
        refetchUsers({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['name', 'email', 'phone', 'role', 'firstName', 'lastName'],
        });
      } catch (error) {
        toast.error('Delete failed!');
      }
    },
    [refetchUsers, paginationModel, filters]
  );

  const handleDeleteRows = useCallback(() => {
    // Delete multiple rows
    Promise.all(selectedRowIds.map((id) => deleteUser(id)))
      .then(() => {
        toast.success('Delete success!');
        setSelectedRowIds([]);
        confirmRows.onFalse();
        // Refetch data after deletion
        refetchUsers({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['name', 'email', 'phone', 'role', 'firstName', 'lastName'],
        });
      })
      .catch(() => {
        toast.error('Delete failed!');
      });
  }, [selectedRowIds, confirmRows, refetchUsers, paginationModel, filters]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const columns = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      minWidth: 280,

      hideable: false,
      renderCell: (params) => (
        <RenderCellUser params={params} onViewRow={() => handleViewRow(params.row._id)} />
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => <RenderCellRole params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderCell: (params) => <RenderCellPhone params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 140,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          key="edit"
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          key="delete"
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row._id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => ({
        field: column.field,
        headerName: column.headerName,
      }));

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            onFilters={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
            onResetFilters={() => setFilters({ filter: '', sort: 'name', order: 'asc' })}
            results={users.length}
            onClose={() => setFilterButtonEl(null)}
          />
        )}

        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={users}
          columns={columns}
          loading={usersLoading}
          getRowId={(row) => row._id}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRowIds(newSelectionModel);
          }}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          rowCount={pagination.totalData}
          paginationMode="server"
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              filters,
              canReset,
              selectedRowIds,
              filteredResults: users.length,
              setFilterButtonEl,
              onOpenConfirmDeleteRows: confirmRows.onTrue,
              onFilters: (field, value) => setFilters((prev) => ({ ...prev, [field]: value })),
            },
          }}
          rowHeight={100}
          // ... existing props ...
          sx={{
            height: users.length > 0 ? `${users.length * 150}px` : 'auto', // Adjust height based on number of rows
            maxHeight: '1000px', // Set a maximum height
            overflow: 'auto', // Allow scrolling if content exceeds max height
            [`& .${gridClasses.columnHeaders}`]: {
              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
            },
          }}
        />
      </Card>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong>{selectedRowIds.length}</strong> items?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
  onFilters,
}) {
  return (
    <GridToolbarContainer
      sx={{
        p: 2,
        pb: 1,
        ...(canReset && {
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }),
      }}
    >
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        sx={{ width: 1 }}
      >
        <Stack direction="row" spacing={1} flexGrow={1}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={filters.filter}
            onChange={(e) => onFilters('filter', e.target.value)}
            InputProps={{
              startAdornment: (
                <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort}
              label="Sort By"
              onChange={(e) => onFilters('sort', e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
              <MenuItem value="role">Role</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.order}
              label="Order"
              onChange={(e) => onFilters('order', e.target.value)}
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Desc</MenuItem>
            </Select>
          </FormControl>

          <GridToolbarColumnsButton />

          <GridToolbarExport />
        </Stack>

        {!!selectedRowIds.length && (
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onOpenConfirmDeleteRows}
          >
            Delete ({selectedRowIds.length})
          </Button>
        )}
      </Stack>
    </GridToolbarContainer>
  );
}
