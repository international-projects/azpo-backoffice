import { UserFormView } from 'src/sections/user/user-form-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Edit User',
};

// ----------------------------------------------------------------------

export default function EditUserPage({ params }) {
  return <UserFormView isEdit={true} userId={params.id} />;
}
