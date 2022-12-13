import {
  Box,
  Container,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Checkbox from '@mui/material/Checkbox';
import FormInput from '../../context/FormInput';
import { register as registerApi } from '../../network/services/accountService';
import { FinalResponse } from '../../models/final-response';
import { LoginResult } from '../../models/account/user.model';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';

const registerSchema = object({
  userName: string()
    .nonempty('User name is required')
    .max(32, 'User name must be less than 32 characters'),
  email: string().nonempty('Email is required').email('Email is invalid'),
  password: string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  confirmPassword: string().nonempty('Please confirm your password'),
  terms: literal(true, {
    invalid_type_error: 'Accept Terms is required',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

type RegisterInput = TypeOf<typeof registerSchema>;

const Register = () => {

  const navigate = useNavigate();
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false);

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    setLoading(true)
    registerApi(values)
      .then((response: AxiosResponse<FinalResponse<LoginResult>>) => {
         setUser(response.data.data)
        setLoading(false)
        navigate("/");
      });
  }; 

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      > 
      <FormProvider {...methods}>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormInput
            name='userName'
            required
            fullWidth
            label='User Name'
            sx={{ mb: 2 }}
          />

          <FormInput
            name='email'
            required
            fullWidth
            label='Email Address'
            type='email'
            sx={{ mb: 2 }}
          />
          <FormInput
            name='password'
            required
            fullWidth
            label='Password'
            type='password'
            sx={{ mb: 2 }}
          />
          <FormInput
            name='confirmPassword'
            required
            fullWidth
            label='Confirm Password'
            type='password'
            sx={{ mb: 2 }}
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox required />}
              {...register('terms')}
              label={
                <Typography color={errors['terms'] ? 'error' : 'inherit'}>
                  Accept Terms and Conditions
                </Typography>
              }
            />
            <FormHelperText error={!!errors['terms']}>
              {errors['terms'] ? errors['terms'].message : ''}
            </FormHelperText>
          </FormGroup>

          <LoadingButton
            variant='contained'
            fullWidth
            type='submit'
            loading={loading}
            sx={{ py: '0.8rem', mt: '1rem' }}
          >
            Register
          </LoadingButton>
        </Box>
      </FormProvider>
    </Box>
    </Container>
  );
}

export default Register