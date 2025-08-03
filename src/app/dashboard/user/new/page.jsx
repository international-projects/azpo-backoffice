import { UserFormView } from 'src/sections/user/user-form-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'New User',
};

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return <UserFormView isEdit={false} />;
} 