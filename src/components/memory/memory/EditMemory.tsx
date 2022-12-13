
import { useEffect, useRef, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, IconButton, InputAdornment, Paper, Skeleton, Stack, Tooltip } from "@mui/material";
import { getOrganizations } from "../../../network/services/organizationService";
import { getMemoryTypes } from "../../../network/services/memoryTypeService";
import { getEnvironmentTypes } from "../../../network/services/environmentTypeService";
import { OrganizationModel } from "../../../models/organization/organization/organizationModel";
import { PaginationFilterModelAllInit } from "../../../models/paginationModel";
import { AxiosResponse } from "axios";
import { FinalResponse } from "../../../models/final-response";
import { ListResponse } from "../../../models/list-response";
import { MemoryTypeModel } from "../../../models/memory/memory-type/memoryTypeModel";
import { EnvironmentTypeModel } from "../../../models/environment-type/environmentTypeModel";
import MemoryModelnit, { MemoryModel } from "../../../models/memory/memory/memoryModel";
import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from "react-router-dom";
import FormSelect, { IOptions } from "../../../context/FormSelect";
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { getMemory, updateMemory } from "../../../network/services/memoryService";
import FormInput from "../../../context/FormInput";
import { LoadingButton } from "@mui/lab";
import { SingleResponse } from "../../../models/single-response";
import FormSwitch from "../../../context/FormSwitch";
import { RemoveRedEye, Timer } from "@mui/icons-material";
import PinCodeModelInit, { PinCodeModel } from "../../../models/account/pin-code.model";
import { checkPinCode } from "../../../network/services/accountService";
import PinCodeDialog from "./PinCodeDialog";
import CountDownTimer from "../../CountDownTimer";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

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

const EditMemory = () => {

    const { id } = useParams();
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState('password')
    const [prevTitle, setPrevTitle] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const [memory, setMemory] = useState<MemoryModel>(MemoryModelnit)
    const [organizationOptions, setOrganizationOptions] = useState<IOptions[]>([])
    const [memoryTypeOptions, setMemoryTypeOptions] = useState<IOptions[]>([])
    const [environmentTypeOptions, setEnvironmentTypeOptions] = useState<IOptions[]>([])
    const [apiResponse, setApiResponse] = useState<any>()
    const [pinCodeChecked, setPinCodeChecked] = useState<boolean>(false)
    const [pinCodeExpiration, setPinCodeExpiration] = useState<number>(1) // mins    
    const [dateOfExpiration, setDateOfExpiration] = useState(new Date().getTime())

    useEffect(() => {
        const duration = (60000 * pinCodeExpiration)
        setDateOfExpiration(new Date().getTime() + duration)

        let timer = setTimeout(() => {
            setPinCodeChecked(false)
        }, duration);
        return () => {
            clearTimeout(timer);
        };
    }, [pinCodeChecked, pinCodeExpiration])

    useEffect(() => {
        fetchMemory();
        fetchOrganizations();
        fetchMemoryTypes();
        fetchEnvironmentTypes();
    }, [pinCodeChecked])

    const fetchMemory = () => {
        setLoading(true)
        if (id) {
            getMemory(id, true)
                .then((response: AxiosResponse<FinalResponse<SingleResponse<MemoryModel>>>) => {
                    let memory = response.data.data.data;
                    memory.confirmPassword = memory.password;
                    setMemory(memory)
                    setApiResponse(response.data)
                })
                .catch(err => {
                    console.log('error', err)
                }).finally(() => {
                    setLoading(false)
                });
        }
    }
    const fetchOrganizations = () => {
        if (organizationOptions.length === 0) {
            getOrganizations(PaginationFilterModelAllInit)
                .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>) => {
                    let options = response.data.data.data.map((optionData) => {
                        let option: IOptions = {
                            text: optionData.title,
                            value: optionData.id
                        }
                        return option
                    })
                    setOrganizationOptions(options)
                    setApiResponse(response.data)

                })
                .catch(err => {
                    console.log('error', err)
                });
        }
    }

    const fetchMemoryTypes = () => {
        if (memoryTypeOptions.length === 0) {
            getMemoryTypes(PaginationFilterModelAllInit)
                .then((response: AxiosResponse<FinalResponse<ListResponse<MemoryTypeModel>>>) => {
                    let options = response.data.data.data.map((optionData) => {
                        let option: IOptions = {
                            text: optionData.title,
                            value: optionData.id
                        }
                        return option
                    })
                    setMemoryTypeOptions(options)
                    setApiResponse(response.data)
                })
                .catch(err => {
                    console.log('error', err)
                });
        }
    }

    const fetchEnvironmentTypes = () => {
        if (environmentTypeOptions.length === 0) {
            getEnvironmentTypes(PaginationFilterModelAllInit)
                .then((response: AxiosResponse<FinalResponse<ListResponse<EnvironmentTypeModel>>>) => {
                    let options = response.data.data.data.map((optionData) => {
                        let option: IOptions = {
                            text: optionData.title,
                            value: optionData.id
                        }
                        return option
                    })
                    let noneOption: IOptions = {
                        text: 'None',
                        value: ``
                    }
                    setEnvironmentTypeOptions([noneOption, ...options])
                    setApiResponse(response.data)
                })
                .catch(err => {
                    console.log('error', err)
                });
        }
    }

    const methods = useForm<MemoryModel>({
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
            reset();
        }
    }, [isSubmitSuccessful]);

    const onSubmitHandler: SubmitHandler<MemoryModel> = (formData) => {
        setLoading(true)
        setMemory(formData)
        updateMemory(formData)
            .then((response: AxiosResponse<FinalResponse<boolean>>) => {
                setApiResponse(response.data)
            })
            .catch(err => {
                console.log('error', err)
            }).finally(() => {
                setLoading(false)
                if (apiResponse?.success) {
                    navigate('/memory')
                }
            });
    };

    useEffect(() => {
        reset(memory);
        setPrevTitle(memory.title)
    }, [memory]);

    useEffect(() => {
        if (apiResponse && !apiResponse?.success) {
            const message = apiResponse?.message;
            console.log('error message', message)
        }
    }, [apiResponse]);

    return (
        <Paper sx={{ p: 2 }} elevation={4}>
            <Typography
                sx={{ flex: '1 1 100%', mb: 1 }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Edit Memory
            </Typography>
            {
                pinCodeChecked &&
                <Stack alignItems='stretch' direction='row'>
                    <Typography
                        sx={{ flex: '1 1 100%', mb: 2 }}
                        variant="h5"
                        id="tableTitle"
                        component="div"
                    >
                        <em>{prevTitle}</em>
                    </Typography>

                    <CountDownTimer targetDate={dateOfExpiration} ></CountDownTimer>
                </Stack>
            }

            <CssBaseline />
            {
                !pinCodeChecked ? <>
                    <Skeleton variant='rectangular' width='100%' height='400px' animation='pulse' ></Skeleton>
                    <PinCodeDialog setPinCodeChecked={setPinCodeChecked} open={!pinCodeChecked} pinCodeExpiration={pinCodeExpiration} setPinCodeExpiration={setPinCodeExpiration}></PinCodeDialog>
                </>
                    :
                    <>

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
                                                                    value={memory.isUserNameSecure}
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
                                                                    value={memory.isUEmailSecure}
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
                                                                    value={memory.isHostOrIpAddressSecure}
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
                                                                    value={memory.isPortSecure}
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
                                                    value={memory.isPortSecure}
                                                />
                                            }
                                            label="Is active"
                                            labelPlacement="start"
                                        />
                                    </Grid>
                                </Grid> 
                                    <Stack alignItems='stretch' direction='row'>

                                        <Button onClick={() => navigate('/memory')}  >Back To List</Button>
                                        <LoadingButton
                                            size='large'
                                            variant='contained'
                                            type='submit'
                                            loading={loading}
                                            color='success'
                                            sx={{ml:8}}
                                        >
                                            Save
                                        </LoadingButton>
                                    </Stack> 
                            </Box>
                        </FormProvider>
                    </>
            }

        </Paper >
    );
}

export default EditMemory