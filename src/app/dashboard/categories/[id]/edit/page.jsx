'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { getCategoryById } from 'src/actions/categories';

import { LoadingScreen } from 'src/components/loading-screen';

import { CategoriesFormView } from 'src/sections/categories/categories-form-view';

// ----------------------------------------------------------------------

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(params.id);
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
        // Handle error - maybe redirect to categories list
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <title> Edit Category</title>

      <CategoriesFormView currentCategory={category} />
    </>
  );
}
