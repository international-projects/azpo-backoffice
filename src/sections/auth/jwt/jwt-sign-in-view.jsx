'use client';

// کتابخانه‌ها
import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// کامپوننت‌های متریال
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

// مسیرها و هوک‌های پروژه
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

/**
 * شِمای اعتبارسنجی ورود با استفاده از Zod
 */
export const SignInSchema = zod.object({
  username: zod.string().min(1, { message: 'Username is required' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// ----------------------------------------------------------------------

/**
 * کامپوننت فرم ورود (با JWT)
 */
export function JwtSignInView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Submitting login data:', data);
    try {
      await signInWithPassword({ username: data.username, password: data.password }, router);
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error instanceof Error ? error.message : String(error));
    }
  });

  // قسمت بالای فرم (تیتر و لینک ثبت‌نام)
  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Login to your account</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Don't have an account?
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
          Sign up
        </Link>
      </Stack>
    </Stack>
  );

  // فرم ورود
  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="username" label="username" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot your password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Logging in..."
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {/* نمایش خطا در صورت وجود */}
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* فرم ورود */}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
