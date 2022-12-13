import {
  Box,
  Container,
  CssBaseline,
} from '@mui/material';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import FormInput from '../../context/FormInput';
// import { login as loginApi } from '../../../network/services/accountService';
import { login as loginApi } from '../../network/services/accountService';
import { LoginResult } from '../../models/account/user.model';
import { FinalResponse } from '../../models/final-response';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';


const loginSchema = object({
  userName: string()
    .nonempty('User name is required')
    .max(100, 'User name must be less than 100 characters'),
  password: string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
});

type LoginInput = TypeOf<typeof loginSchema>;

const Login = () => {

  const navigate = useNavigate();
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;


  useEffect(() => {
    setUser(undefined)
  }, []);


  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    setLoading(true)
    loginApi(values)
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
              name='password'
              required
              fullWidth
              label='Password'
              type='password'
              sx={{ mb: 2 }}
            />

            <LoadingButton
              variant='contained'
              fullWidth
              type='submit'
              loading={loading}
              sx={{ py: '0.8rem', mt: '1rem' }}
            >
              Login
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
}

export default Login