
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Paper, Switch } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import FormSelect, { IOptions } from "../../../context/FormSelect";
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { createMemory } from "../../../network/services/memoryService";
import FormInput from "../../../context/FormInput";
import { LoadingButton } from "@mui/lab";

const formDataBase = z.object({
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
    hostOrIpAddress: string().trim(),
    port: string().trim(),
    isHostOrIpAddressSecure: boolean().default(false),
    isPortSecure: boolean().default(false),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    description: string().trim(),
    active: boolean().default(true),
});

const formData = formDataBase.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})

const NewMemory = () => {
    const navigate = useNavigate()
    const [createAnother, setCreateAnother] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false); 
    const [organizationOptions, setOrganizationOptions] = useState<IOptions[]>([])
    const [memoryTypeOptions, setMemoryTypeOptions] = useState<IOptions[]>([])
    const [environmentTypeOptions, setEnvironmentTypeOptions] = useState<IOptions[]>([])

    const [submitResponse, setSubmitResponse] = useState<FinalResponse<boolean>>()

    useEffect(() => {
        fetchOrganizations();
        fetchMemoryTypes();
        fetchEnvironmentTypes();
    }, [])


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
                    setEnvironmentTypeOptions(options)
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
        handleSubmit,
        reset,
        formState: { isSubmitSuccessful, errors }
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const onSubmitHandler: SubmitHandler<MemoryModel> = (formData) => {
        setLoading(true) 
        createMemory(formData)
            .then((response: AxiosResponse<FinalResponse<boolean>>) => {
                setSubmitResponse(response.data)
            })
            .catch(err => {
                console.log('error', err)
            }).finally(() => {
                setLoading(false)
                if (submitResponse?.success) {
                    if (!createAnother) {
                        navigate('/memory')
                    }
                } else {
                    const message = submitResponse?.message;
                    console.log('error message', message)
                }
            });
    };

    return (
        <Paper sx={{ p: 2 }} elevation={4}>
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                New Memory
            </Typography>
            <CssBaseline />
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
                            />
                            <FormControlLabel
                                control={
                                    <Switch name="isUserNameSecure" id="isUserNameSecure"
                                    />
                                }
                                label="Save user name as encrypted"
                                labelPlacement="start"
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
                            />
                            <FormControlLabel
                                control={
                                    <Switch name="isUEmailSecure" id="isUEmailSecure"
                                    />
                                }
                                label="Save email as encrypted"
                                labelPlacement="start"
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
                            />
                            <FormControlLabel
                                control={
                                    <Switch name="isHostOrIpAddressSecure" id="isHostOrIpAddressSecure"
                                    />
                                }
                                label="Save host / IP address as encrypted"
                                labelPlacement="start"
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
                            />
                            <FormControlLabel
                                control={
                                    <Switch name="isPortSecure" id="isPortSecure"
                                    />
                                }
                                label="Save port as encrypted"
                                labelPlacement="start"
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
                                type='password'
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item md >
                            <FormInput
                                margin="normal"
                                fullWidth
                                id="confirmPassword"
                                label="Confirm Password"
                                name="confirmPassword"
                                type='password'
                                autoComplete='off'
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
                                    <Switch name="active" id="active"
                                    />
                                }
                                label="Is active"
                                labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                    <Grid container gap={1}>
                        <Grid item md sx={{ alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch name="createAnother" id="createAnother"
                                        checked={createAnother}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setCreateAnother(checked)}
                                    />
                                }
                                label="Create Another"
                                labelPlacement="start"
                            />
                            <LoadingButton
                                size='large'
                                variant='outlined'
                                type='submit'
                                loading={loading}
                                sx={{ ml: 8 }}
                            >
                                Save
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            </FormProvider>
        </Paper>
    );
}

export default NewMemory