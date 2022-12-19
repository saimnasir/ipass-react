
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { Box, Button, Card, CardActions, CardContent, FormControlLabel, Grid, Paper, Skeleton, Stack, Switch, TextField } from "@mui/material";
import { getOrganizations } from "../../../network/services/organizationService";
import { getMemoryTypes } from "../../../network/services/memoryTypeService";
import { getEnvironmentTypes } from "../../../network/services/environmentTypeService";
import { OrganizationModel } from "../../../models/organization/organization/organizationModel";
import { PaginationFilterModelAllInit, PaginationTenantFilterModelInit } from "../../../models/paginationModel";
import { AxiosResponse } from "axios";
import { FinalResponse } from "../../../models/final-response";
import { ListResponse } from "../../../models/list-response";
import { MemoryTypeModel } from "../../../models/memory/memory-type/memoryTypeModel";
import { EnvironmentTypeModel } from "../../../models/environment-type/environmentTypeModel";
import MemoryModelnit, { MemoryModel } from "../../../models/memory/memory/memoryModel";
import { useNavigate, useParams } from "react-router-dom";
import { IOptions } from "../../../context/FormSelect";
import { getMemory } from "../../../network/services/memoryService";
import { SingleResponse } from "../../../models/single-response";
import CountDownTimer from "../../CountDownTimer";
import PinCodeDialog from "./PinCodeDialog";
import { styled } from '@mui/material/styles';

type ICaptionKeyPair = { caption: string, key: string, order: number }
type IColumnValuePair = { column: string, value: string | boolean | undefined | null, order: number }

const memoryCaptionKeyPairs: ICaptionKeyPair[] = [
    {
        caption: 'Title',
        key: 'title',
        order: 1
    },
    {
        caption: 'Organization',
        key: 'organizationId',
        order: 2
    },
    {
        caption: 'Memory Type',
        key: 'memoryTypeId',
        order: 3
    },
    {
        caption: 'Environment Type',
        key: 'environmentTypeId',
        order: 4
    },
    {
        caption: 'Username',
        key: 'userName',
        order: 5
    },
    {
        caption: 'Email',
        key: 'email',
        order: 7
    },
    {
        caption: 'Is username encrypted',
        key: 'isUserNameSecure',
        order: 6
    },
    {
        caption: 'Is email encrypted',
        key: 'isUEmailSecure',
        order: 8
    },
    {
        caption: 'Host/IP Address',
        key: 'hostOrIpAddress',
        order: 9
    },
    {
        caption: 'Is host/IP address encrypted',
        key: 'isHostOrIpAddressSecure',
        order: 10
    },
    {
        caption: 'Port',
        key: 'port',
        order: 11
    },
    {
        caption: 'Is port encrypted',
        key: 'isPortSecure',
        order: 12
    },
    {
        caption: 'Password',
        key: 'password',
        order: 13
    },
    {
        caption: 'Description',
        key: 'description',
        order: 14
    },
    {
        caption: 'Is active',
        key: 'active',
        order: 15
    },
]
const ReadMemory = () => {

    const { id } = useParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [memory, setMemory] = useState<MemoryModel>(MemoryModelnit)
    const [organizationOptions, setOrganizationOptions] = useState<IOptions[]>([])
    const [memoryTypeOptions, setMemoryTypeOptions] = useState<IOptions[]>([])
    const [environmentTypeOptions, setEnvironmentTypeOptions] = useState<IOptions[]>([])
    const [apiResponse, setApiResponse] = useState<any>()
    const [pinCodeChecked, setPinCodeChecked] = useState<boolean>(false)
    const [pinCodeExpiration, setPinCodeExpiration] = useState<number>(1) // mins    
    const [dateOfExpiration, setDateOfExpiration] = useState(new Date().getTime())
    const [memoryData, setMemoryData] = useState<IColumnValuePair[]>([])

    useEffect(() => {
        type ObjectKey = keyof MemoryModel;
        let data: IColumnValuePair[] = [];
        let keys = Object.keys(memory);
        // console.log('keys', keys)
        keys.forEach(key => {
            let captionKeyPair = memoryCaptionKeyPairs.find(k => k.key === key)
            if (captionKeyPair) {
                const objectKey = key as ObjectKey;
                let value = memory[objectKey]

                if (key === 'organizationId' && typeof value === 'string') {
                    let organization = organizationOptions.find(o => o.value === value);
                    if (organization && typeof organization.text === 'string') {
                        value = organization.text
                    }
                }
                if (key === 'memoryTypeId' && typeof value === 'string') {
                    let memoryType = memoryTypeOptions.find(o => o.value === value);
                    if (memoryType && typeof memoryType.text === 'string') {
                        value = memoryType.text
                    }
                }

                if (key === 'environmentTypeId' && typeof value === 'string') {
                    let environmentType = environmentTypeOptions.find(o => o.value === value);
                    if (environmentType && typeof environmentType.text === 'string') {
                        value = environmentType.text
                    }
                }
                data.push({ column: captionKeyPair.caption, value: value, order: captionKeyPair.order })
            }
        })
        setMemoryData(data.sort((a, b) => a.order - b.order))
    }, [memory])

    useEffect(() => {
        const duration = (60000 * pinCodeExpiration)
        setDateOfExpiration(new Date().getTime() + duration * 1000)

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
            getMemoryTypes(PaginationTenantFilterModelInit)
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

    useEffect(() => {
        // if (apiResponse) {
        //     console.log('apiResponse', apiResponse)
        // }
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
                Memory Details
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
                        <em>{memory.title}</em>
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
                        <Card elevation={0}>
                            <CardContent>
                                <Box sx={{   p: 2 }}>
                                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
                                        {memoryData.map((row) => (
                                            <Grid item xs={1} sm={1} md={1} lg={1} >
                                                <Item elevation={1}>
                                                    <Stack direction='row' spacing={1}>
                                                        {
                                                            typeof row.value === 'boolean' ?
                                                                <FormControlLabel disabled
                                                                    control={<Switch checked={row.value} />}
                                                                    label={row.column}
                                                                />
                                                                :
                                                                <TextField
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    label={row.column}
                                                                    value={row.value ? row.value : ' '}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size='small'
                                                                />

                                                        }
                                                    </Stack>

                                                </Item>
                                            </Grid>
                                        ))
                                        }
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => navigate('/memory')}  >Back To List</Button>
                            </CardActions>
                        </Card>
                    </>
            }
        </Paper>
    );
}


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export default ReadMemory