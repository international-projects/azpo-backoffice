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
import { deleteCategory, useGetCategories } from 'src/actions/categories';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CategoriesTableFiltersResult } from '../categories-table-filters-result';
import {
  RenderCellCategory,
  RenderCellLanguage,
  RenderCellSubTitle,
  RenderCellCreatedAt,
} from '../categories-table-row-render';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'All Languages' },
  { value: 'EN', label: 'English' },
  { value: 'FA', label: 'فارسی' },
];

// ----------------------------------------------------------------------

export function CategoriesListView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [filters, setFilters] = useState({
    filter: '',
    sort: 'title',
    order: 'asc',
    lang: '',
  });

  const { categories, categoriesLoading, refetchCategories, pagination } = useGetCategories({
    searchFields: ['title', 'sub_title'],
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
      refetchCategories({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: filters.sort,
        order: filters.order,
        filter: filters.filter,
        searchFields: ['title', 'sub_title'],
        lang: filters.lang,
      });
    } else {
      timeoutId = setTimeout(() => {
        refetchCategories({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['title', 'sub_title'],
          lang: filters.lang,
        });
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [paginationModel, filters, refetchCategories]);

  const canReset =
    filters.filter !== '' ||
    filters.sort !== 'title' ||
    filters.order !== 'asc' ||
    filters.lang !== '';

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteCategory(id);
        toast.success('Delete success!');
        // Refetch data after deletion
        refetchCategories({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['title', 'sub_title'],
          lang: filters.lang,
        });
      } catch (error) {
        toast.error('Delete failed!');
      }
    },
    [refetchCategories, paginationModel, filters]
  );

  const handleDeleteRows = useCallback(() => {
    // Delete multiple rows
    Promise.all(selectedRowIds.map((id) => deleteCategory(id)))
      .then(() => {
        toast.success('Delete success!');
        setSelectedRowIds([]);
        confirmRows.onFalse();
        // Refetch data after deletion
        refetchCategories({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          sort: filters.sort,
          order: filters.order,
          filter: filters.filter,
          searchFields: ['title', 'sub_title'],
          lang: filters.lang,
        });
      })
      .catch(() => {
        toast.error('Delete failed!');
      });
  }, [selectedRowIds, confirmRows, refetchCategories, paginationModel, filters]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.categories.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.categories.edit(id));
    },
    [router]
  );

  const columns = [
    {
      field: 'title',
      headerName: 'Category',
      flex: 1,
      minWidth: 280,
      hideable: false,
      renderCell: (params) => (
        <RenderCellCategory params={params} onViewRow={() => handleViewRow(params.row._id)} />
      ),
    },
    {
      field: 'sub_title',
      headerName: 'Sub Title',
      width: 200,
      renderCell: (params) => <RenderCellSubTitle params={params} />,
    },
    {
      field: 'lang',
      headerName: 'Language',
      width: 120,
      renderCell: (params) => <RenderCellLanguage params={params} />,
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
        heading="Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Categories', href: paths.dashboard.categories.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.categories.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Category
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        {canReset && (
          <CategoriesTableFiltersResult
            filters={filters}
            onFilters={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
            onResetFilters={() => setFilters({ filter: '', sort: 'title', order: 'asc', lang: '' })}
            results={categories.length}
            onClose={() => setFilterButtonEl(null)}
          />
        )}

        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={categories}
          columns={columns}
          loading={categoriesLoading}
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
              filteredResults: categories.length,
              setFilterButtonEl,
              onOpenConfirmDeleteRows: confirmRows.onTrue,
              onFilters: (field, value) => setFilters((prev) => ({ ...prev, [field]: value })),
              languageOptions: LANGUAGE_OPTIONS,
            },
          }}
          rowHeight={100}
          // ... existing props ...
          sx={{
            height: categories.length > 0 ? `${(categories.length + 1) * 120}px` : 'auto', // Adjust height based on number of rows
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
  languageOptions,
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
            placeholder="Search categories..."
            value={filters.filter}
            onChange={(e) => onFilters('filter', e.target.value)}
            InputProps={{
              startAdornment: (
                <Iconify icon="eva:search-fill" sx={{ mr: 1, color: 'text.disabled' }} />
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={filters.lang}
              label="Language"
              onChange={(e) => onFilters('lang', e.target.value)}
            >
              {languageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort}
              label="Sort By"
              onChange={(e) => onFilters('sort', e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="sub_title">Sub Title</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
              <MenuItem value="lang">Language</MenuItem>
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
