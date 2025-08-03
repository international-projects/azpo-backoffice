import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { getCategories, deleteCategory } from 'src/actions/categories';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { CategoriesTableRow } from '../categories-table-row';
import { CategoriesFormView } from '../categories-form-view';
import { CategoriesTableToolbar } from '../categories-table-toolbar';
import { CategoriesTableFiltersResult } from '../categories-table-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  language: 'all',
};

// ----------------------------------------------------------------------

export function CategoriesViewSimple() {
  const router = useRouter();
  const theme = useTheme();
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !!(filters.name || filters.language !== 'all');

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.categories.edit(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      const category = tableData.find((item) => item._id === id);
      setSelectedCategory(category);
      setOpenForm(true);
    },
    [tableData]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteCategory(id);
        const deleteRow = tableData.filter((row) => row._id !== id);
        setTableData(deleteRow);

        toast.success('Delete success!');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Delete failed!');
      }
    },
    [tableData]
  );

  const handleOpenConfirm = useCallback(() => {
    confirm.onTrue();
  }, [confirm]);

  const handleCloseConfirm = useCallback(() => {
    confirm.onFalse();
  }, [confirm]);

  const handleOpenForm = useCallback(() => {
    setSelectedCategory(null);
    setOpenForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedCategory(null);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setTableData(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories!');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSuccess = useCallback(() => {
    // Refresh data after successful operation
    fetchCategories();
  }, [fetchCategories]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Categories</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenForm}
          >
            New Category
          </Button>
        </Box>

        <Card>
          <CategoriesTableToolbar
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
          />

          <CategoriesTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />

          <Scrollbar>
            <Stack spacing={2} sx={{ p: 2.5 }}>
              {dataFiltered.map((row) => (
                <CategoriesTableRow
                  key={row._id}
                  row={row}
                  selected={selectedRows.includes(row._id)}
                  onSelectRow={() => {
                    setSelectedRows((prev) =>
                      prev.includes(row._id)
                        ? prev.filter((id) => id !== row._id)
                        : [...prev, row._id]
                    );
                  }}
                  onViewRow={() => handleViewRow(row._id)}
                  onEditRow={() => handleEditRow(row._id)}
                  onDeleteRow={() => handleDeleteRow(row._id)}
                />
              ))}

              {dataFiltered.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No categories found
                  </Typography>
                </Box>
              )}
            </Stack>
          </Scrollbar>
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleCloseConfirm}>
            Delete
          </Button>
        }
      />

      {openForm && (
        <CategoriesFormView
          currentCategory={selectedCategory}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { name, language } = filters;

  let filteredData = [...inputData];

  if (name) {
    filteredData = filteredData.filter(
      (category) => category.title.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (language !== 'all') {
    filteredData = filteredData.filter((category) => category.lang === language);
  }

  return filteredData;
}
