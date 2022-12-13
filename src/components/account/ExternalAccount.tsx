import {
    Box,
    Button,
    Container,
    CssBaseline,
    Divider,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Stack,
    Typography,
} from '@mui/material';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Checkbox from '@mui/material/Checkbox';
import FormInput from '../../context/FormInput';
// import { login as loginApi } from '../../../network/services/accountService';
import { login as loginApi } from '../../network/services/accountService';
import { LoginResult } from '../../models/account/user.model';
import { FinalResponse } from '../../models/final-response';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { loginGoogle, loginFacebook, loginOkta } from '../../network/services/accountService'
import FacebookIcon from '@mui/icons-material/FacebookRounded'
import GoogleIcon from '@mui/icons-material/Google'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { purple } from '@mui/material/colors';

const ExternalAccount = () => {
    const [loading, setLoading] = useState(false);
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Divider variant='middle'> Continue with</Divider>
            <Box
                sx={{
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Stack spacing={2} direction='row'>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={loginGoogle}
                        startIcon={<GoogleIcon color='error'/>}
                        disabled={loading}
                    >
                        Google
                    </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={loginFacebook}
                        startIcon={<FacebookIcon color='primary'/>}
                        disabled={loading}
                    >
                        Facebook
                    </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={loginOkta}
                        startIcon={<AccountCircleIcon color='secondary'/>}
                        disabled={loading}
                    >
                        Okta
                    </Button>
                </Stack>
            </Box>
        </Container >
    )
}

export default ExternalAccount