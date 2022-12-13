import React, { useEffect, useState } from 'react';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { MemoryModel } from '../../../models/memory/memory/memoryModel';
import { LoadingButton } from '@mui/lab';
import { Box, Switch, FormControlLabel, DialogProps, Stack, Grid, IconButton, InputAdornment } from '@mui/material';
import FormInput from '../../../context/FormInput';
import FormSelect, { IOptions } from '../../../context/FormSelect';
import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { Action } from '../../../models/enums/Actions';
import CountDownTimer from '../../CountDownTimer';
import { RemoveRedEye } from '@mui/icons-material';
import FormSwitch from '../../../context/FormSwitch';

const formDataBase = z.object({
    id: string().trim(),
    title: string().trim()
        .min(1, 'Title is required'),
    organizationId: string()
        .min(1, 'Organization is required'),
    memoryTypeId: string()
        .min(1, 'Memory Type is required'),
    environmentTypeId: string().nullable(),
    userName: string().trim()
        .min(1, 'Username is required'),
    email: string().trim()
        .min(1, 'Email is required'),
    isUserNameSecure: boolean().default(false),
    isUEmailSecure: boolean().default(false),
    hostOrIpAddress: string().nullable(),
    port: string().nullable(),
    isHostOrIpAddressSecure: boolean().default(false),
    isPortSecure: boolean().default(false),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    description: string().nullable(),
    active: boolean().default(true),
});

const formData = formDataBase.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})


type IMemoryEditorProps = {
    memoryModel: MemoryModel,
    onSubmitHandler: SubmitHandler<MemoryModel>,
    onHandleClose: () => void,
    loading: boolean,
    action: Action,
    organizationOptions: IOptions[],
    memoryTypeOptions: IOptions[],
    environmentTypeOptions: IOptions[],
    dateOfExpiration: number
} &  DialogProps;


const getTitle = (action: Action) => {
    if (action == Action.Create) {
        return 'Create Memory'
    }
    else if (action == Action.Update) {
        return 'Update Memory'
    } else if (action == Action.Delete) {
        return 'Delete Memory'
    }
    return 'Memory'
}

const MemoryEditor: React.FC<IMemoryEditorProps> = ({ organizationOptions, environmentTypeOptions, dateOfExpiration, memoryTypeOptions, action, open, onHandleClose, memoryModel, onSubmitHandler, loading }) => {
    const [createAnother, setCreateAnother] = useState<boolean>(true)
    const [dialogTitle, setDialogTitle] = useState<string>('')
    const [passwordType, setPasswordType] = useState('password')

    const methods = useForm<MemoryModel>({
        resolver: zodResolver(formData),
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitSuccessful, errors }
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    useEffect(() => {
        reset(memoryModel);
        setDialogTitle(getTitle(action))
    }, [memoryModel]);

    return (
        <>
            <Dialog
                fullWidth={true}
                fullScreen      
                open={open}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-desc'
                closeAfterTransition={true}
                onClose={onHandleClose}
            >
                <DialogTitle sx={{ alignContent: 'center' }}>
                    <Typography sx={{ alignContent: 'center' }} component='h1'>
                        {dialogTitle}</Typography>
                    {
                        memoryModel?.title &&
                        <Stack alignItems='stretch' direction='row'>
                            <Typography
                                sx={{ flex: '1 1 100%', mb: 2 }}
                                variant="h5"
                                id="tableTitle"
                                component="div"
                            >
                                <em>{memoryModel.title}</em>
                            </Typography>

                            <CountDownTimer targetDate={dateOfExpiration} ></CountDownTimer>
                        </Stack>
                    }
                </DialogTitle>
                <DialogContent  >
                    <FormProvider {...methods}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmitHandler)}
                            noValidate
                            autoComplete="off"
                            sx={{
                                m: 2,
                            }}
                        >
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormInput
                                        name='title'
                                        required
                                        fullWidth
                                        label='Title'
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item md >
                                    <FormSelect
                                        name='organizationId'
                                        placeholder='Organization'
                                        required
                                        fullWidth
                                        label='Organization'
                                        options={organizationOptions}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormSelect
                                        name='memoryTypeId'
                                        placeholder='Memory Type'
                                        required
                                        fullWidth
                                        label='Memory Type'
                                        options={memoryTypeOptions}
                                    />
                                </Grid>
                                <Grid item md >
                                    <FormSelect
                                        name='environmentTypeId'
                                        placeholder='Environment Type'
                                        fullWidth
                                        label='Environment Type'
                                        options={environmentTypeOptions}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="userName"
                                        label="User Name"
                                        name="userName"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <FormControlLabel
                                                        control={
                                                            <FormSwitch name="isUserNameSecure" id="isUserNameSecure"
                                                                value={memoryModel.isUserNameSecure}
                                                            />
                                                        }
                                                        label="Encrypt"
                                                        labelPlacement="start"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <FormControlLabel
                                                        control={
                                                            <FormSwitch name="isUEmailSecure" id="isUEmailSecure"
                                                                value={memoryModel.isUEmailSecure}
                                                            />
                                                        }
                                                        label="Encrypt"
                                                        labelPlacement="start"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        fullWidth
                                        id="hostOrIpAddress"
                                        label="Host / IP Address"
                                        name="hostOrIpAddress"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <FormControlLabel
                                                        control={
                                                            <FormSwitch name="isHostOrIpAddressSecure" id="isHostOrIpAddressSecure"
                                                                value={memoryModel.isHostOrIpAddressSecure}
                                                            />
                                                        }
                                                        label="Encrypt"
                                                        labelPlacement="start"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}

                                    />
                                </Grid>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        fullWidth
                                        id="port"
                                        label="Port"
                                        name="port"
                                        type='number'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <FormControlLabel
                                                        control={
                                                            <FormSwitch name="isPortSecure" id="isPortSecure"
                                                                value={memoryModel.isPortSecure}
                                                            />
                                                        }
                                                        label="Encrypt"
                                                        labelPlacement="start"
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}

                                    />

                                </Grid>
                            </Grid>
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        name="password"
                                        type={passwordType}
                                        autoComplete="off"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <IconButton
                                                        onMouseOver={() => setPasswordType('text')}
                                                        onMouseLeave={() => setPasswordType('password')}
                                                    >
                                                        <RemoveRedEye />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        fullWidth
                                        id="confirmPassword"
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type={passwordType}
                                        autoComplete='off'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"  >
                                                    <IconButton
                                                        onMouseOver={() => setPasswordType('text')}
                                                        onMouseLeave={() => setPasswordType('password')}
                                                    >
                                                        <RemoveRedEye />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container gap={1}>
                                <Grid item md >
                                    <FormInput
                                        margin="normal"
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item md >
                                    <FormControlLabel
                                        control={
                                            <FormSwitch name="active" id="active"
                                                value={memoryModel.isPortSecure}
                                            />
                                        }
                                        label="Is active"
                                        labelPlacement="start"
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions>
                                {
                                    action === Action.Create
                                    &&
                                    <FormControlLabel sx={{ width: '50%' }}
                                        control={<Switch checked={createAnother} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setCreateAnother(checked)} />}
                                        label="Create Another" />
                                }
                                <Button type='button' onClick={onHandleClose} color='primary'>Discard</Button>
                                <LoadingButton
                                    size='large'
                                    variant='contained'
                                    type='submit'
                                    loading={loading}
                                    color='success'
                                    sx={{ ml: 8 }}
                                    loadingPosition='start'
                                    startIcon={<SaveIcon />}
                                >
                                    Save
                                </LoadingButton>
                            </DialogActions>
                        </Box>
                    </FormProvider>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default MemoryEditor