'use client';

// import { Helmet } from 'react-helmet-async';

import { CategoriesListView } from 'src/sections/categories/view/categories-list-view';

// ----------------------------------------------------------------------

export default function CategoriesPage() {
  return (
    <>
      {/* <Helmet>
        <title> Categories</title>
      </Helmet> */}

      <CategoriesListView />
    </>
  );
}
