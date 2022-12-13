
import { FunctionComponent, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, IconButton, InputAdornment, Paper } from "@mui/material";
import { AxiosResponse } from "axios";
import { z, boolean, string, date, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from "react-router-dom";
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { LoadingButton } from "@mui/lab";
import { RemoveRedEye } from "@mui/icons-material";
import { ProfileModel } from "../../models/account/user.model";
import FormSelect, { IOptions } from "../../context/FormSelect";
import { FinalResponse } from "../../models/final-response";
import FormInput from "../../context/FormInput";
import FormSwitch from "../../context/FormSwitch";
import { createPinCode, updateProfile } from "../../network/services/accountService";
import { PinCodeModel } from "../../models/account/pin-code.model";

const formData = z.object({
    code: string().trim()
        .min(1, 'Pin Code is required')
        .min(4, 'Min 4 lenth code is required')
        .max(8, 'Max 4 lenth code is required'),
});
type IEditProfileProps = { profile: ProfileModel, setProfile: React.Dispatch<React.SetStateAction<ProfileModel | undefined>> }
type IMode = 'edit' | 'view'
const EditPinCode: FunctionComponent<IEditProfileProps> = ({ profile, setProfile, ...otherProps }) => {

    const [mode, setMode] = useState<IMode>('view')
    const [loading, setLoading] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState<any>()

    const methods = useForm<PinCodeModel>({
        resolver: zodResolver(formData),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitSuccessful, errors }
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(profile.pinCode);
        }
    }, [isSubmitSuccessful]);


    const onSubmitHandler: SubmitHandler<PinCodeModel> = (formData) => {
        setLoading(true)
        setProfile({ ...profile, pinCode: { ...profile.pinCode, code: formData.code } })
        createPinCode({ code: formData.code })
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
        reset(profile.pinCode);
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
                            name='code'
                            required
                            fullWidth
                            label='Code'
                            autoFocus
                            disabled={mode.toString() === 'view'}
                        />
                    </Grid>
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

export default EditPinCode