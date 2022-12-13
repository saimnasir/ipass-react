
import { FunctionComponent, JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, IconButton, InputAdornment, Paper, TextField, TextFieldProps } from "@mui/material";
import { AxiosResponse } from "axios";
import { z, boolean, string, date, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from "react-router-dom";
import { SubmitHandler, FormProvider, useForm, Controller } from 'react-hook-form';
import { LoadingButton } from "@mui/lab";
import { RemoveRedEye } from "@mui/icons-material";
import { ProfileModel, User } from "../../models/account/user.model";
import FormSelect, { IOptions } from "../../context/FormSelect";
import { FinalResponse } from "../../models/final-response";
import FormInput from "../../context/FormInput";
import FormSwitch from "../../context/FormSwitch";
import { updateProfile } from "../../network/services/accountService";
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import FormDatePicker from "../../context/FormDatePicker";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import { Stack } from "@mui/system";

const formData = z.object({
    userName: string().trim()
        .min(1, 'Username is required'),
    email: string().trim()
        .min(1, 'Email is required'),
    phoneNumber: string().trim().nullable(),
    firstName: string().trim()
        .min(1, 'Email is required'),
    lastName: string().trim()
        .min(1, 'Email is required'),
    //birtDate: date().nullable()
});
type IEditProfileProps = { profile: ProfileModel, setProfile: React.Dispatch<React.SetStateAction<ProfileModel | undefined>> }
type IMode = 'edit' | 'view'
const EditProfile: FunctionComponent<IEditProfileProps> = ({ profile, setProfile, ...otherProps }) => {

    const [mode, setMode] = useState<IMode>('view')
    const [loading, setLoading] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState<any>()

    const methods = useForm<User>({
        resolver: zodResolver(formData),
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitSuccessful, errors }
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(profile.user);
        }
    }, [isSubmitSuccessful]);


    const onSubmitHandler: SubmitHandler<User> = (formData) => {
        console.log('onSubmitHandler.formData', formData)
        setLoading(true)
        let user = { ...formData, birthDate: selectedDate }
        setProfile({ ...profile, user: user })
        updateProfile(user)
            .then((response: AxiosResponse<FinalResponse<boolean>>) => {
                setApiResponse(response.data)
            })
            .catch(err => {
                console.log('error', err)
            }).finally(() => {
                setLoading(false)
            });
    };
    useEffect(() => {
        reset(profile.user);
    }, [profile]);

    useEffect(() => {
        if (apiResponse) {
            if (!apiResponse?.success) {
                const message = apiResponse?.message;
                console.log('error message', message)
            } else {
                setMode('view')
            }
        }
    }, [apiResponse]);

    const [selectedDate, setSelectedDate] = useState<Date | null>(profile.user.birthDate)

    const handleBirthDateChange = (newValue: Dayjs | null) => {
        console.log('handleBirthDateChange', newValue)
        if (newValue) {
            let date = newValue.toDate();
            setSelectedDate(date)
        }
    }

    return (

        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmitHandler)}
                noValidate
                autoComplete="off"
                sx={{
                    mt: 1,
                }}
            >
                <Grid container gap={1}>
                    <Grid item md >
                        <FormInput
                            name='userName'
                            required
                            fullWidth
                            label='User Name'
                            autoFocus
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
                    <Grid item md >
                        <FormInput
                            name='email'
                            required
                            fullWidth
                            label='Email'
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
                </Grid>
                <Grid container gap={1}>
                    <Grid item md >
                        <FormInput
                            name='firstName'
                            required
                            fullWidth
                            label='First Name'
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
                    <Grid item md >
                        <FormInput
                            name='lastName'
                            required
                            fullWidth
                            label='Last Name'
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
                </Grid>
                <Grid container gap={1}>
                    <Grid item md >
                        <FormInput
                            name='phoneNumber'
                            fullWidth
                            label='Phone Number'
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
                    <Grid item md >
                        <DatePicker
                            label="Birth Date"
                            inputFormat="DD/MMM/YYYY"
                            value={selectedDate}
                            disabled={mode.toString() === 'view'}
                            onChange={handleBirthDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                </Grid>

                <Grid container gap={1}>
                    <Grid item md sx={{ alignItems: 'center' }}>
                        {
                            mode === 'view' ?
                                (
                                    < Button
                                        size='large'
                                        variant='outlined'
                                        type='button'
                                        sx={{ ml: 8 }}
                                        onClick={() => setMode('edit')}
                                    >
                                        Edit
                                    </ Button>
                                ) :
                                (
                                    <>
                                        < Button
                                            size='large'
                                            variant='outlined'
                                            type='button'
                                            sx={{ ml: 8 }}
                                            onClick={() => setMode('view')}
                                        >
                                            Discard
                                        </ Button>
                                        <LoadingButton
                                            size='large'
                                            variant='outlined'
                                            type='submit'
                                            loading={loading}
                                            sx={{ ml: 8 }}
                                        >
                                            Save
                                        </LoadingButton>
                                    </>
                                )
                        }

                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    )
}

export default EditProfile