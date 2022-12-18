import React, { useEffect, useState } from 'react'
import { getMemoryHistory } from '../../../network/services/memoryService'
import { getMemoryTypes } from '../../../network/services/memoryTypeService'
import { MemoryModel } from '../../../models/memory/memory/memoryModel'
import { FinalResponse } from '../../../models/final-response'
import { PaginationDecodeModel, PaginationDecodeModelInitForHistory, PaginationFilterModelAllInit } from '../../../models/paginationModel'
import {
    TableHead, TableRow, TableCell, Paper, Box,
    SortDirection, TablePagination, Button, IconButton, Typography, Stack, Skeleton
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { ListResponse } from '../../../models/list-response'
import TableSortLabel from '@mui/material/TableSortLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { DataCell } from '../../../library/DataCell'
import TablePaginationActions from '../../../library/TablePaginationActions'
import { MemoryModelEnhancedTableProps } from '../../../library/props/EnhancedTable'
import { MemoryTypeModel } from '../../../models/memory/memory-type/memoryTypeModel'
import { getOrganizations } from '../../../network/services/organizationService'
import { OrganizationModel } from '../../../models/organization/organization/organizationModel'
import { getEnvironmentTypes } from '../../../network/services/environmentTypeService'
import { EnvironmentTypeModel } from '../../../models/environment-type/environmentTypeModel'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IOptions } from '../../../context/FormSelect'
import CountDownTimer from '../../CountDownTimer'
import PinCodeDialog from './PinCodeDialog'
import { useNavigate, useParams } from "react-router-dom";
import MemoryHistoryItem from './MemoryHistoryItem'


const dataCells: readonly DataCell<MemoryModel>[] = [
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Title',
        minWidth: 170,
        onDetail: false
    },
    {
        id: 'organizationId',
        numeric: false,
        disablePadding: true,
        label: 'Organization',
        minWidth: 170,
        getNameFrom(items, id, property) {
            let item = items.filter(item => item.id === id)[0];
            return !item ? id : item[property];
        },
        onDetail: false
    },
    {
        id: 'memoryTypeId',
        numeric: false,
        disablePadding: true,
        label: 'Memory Type',
        minWidth: 170,
        getNameFrom(items, id, property) {
            let item = items.filter(item => item.id === id)[0];
            return !item ? id : item[property];
        },
        onDetail: false
    },
    {
        id: 'environmentTypeId',
        numeric: false,
        disablePadding: true,
        label: 'Environment Type',
        minWidth: 170,
        getNameFrom(items, id, property) {
            let item = items.filter(item => item.id === id)[0];
            return !item ? id : item[property];
        },
        onDetail: true
    },
    {
        id: 'userName',
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'User Name',
        minWidth: 170,
        onDetail: false
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Email',
        minWidth: 170,
        onDetail: false
    },
    {
        id: 'port',
        numeric: true,
        disablePadding: false,
        align: 'right',
        label: 'Port',
        format: (value: number) => value.toLocaleString('tr-TR'),
        minWidth: 170,
        onDetail: true
    },
    {
        id: 'password',
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Password',
        minWidth: 170,
        onDetail: false
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Description',
        minWidth: 170,
        onDetail: true
    },

    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Created At',
        minWidth: 170,
        onDetail: true
    }
];

const MemoryHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate()

    const [historyOf, setHistoryOf] = useState<MemoryModel>()
    const [rows, setRows] = useState<MemoryModel[]>([])
    const [totalItemCount, setTotalItemCount] = useState<number>(0)
    const [pagination, setPagination] = useState<PaginationDecodeModel>(PaginationDecodeModelInitForHistory)
    const [dense, setDense] = React.useState(false);

    const [memoryTypeOptions, setMemoryTypeOptions] = useState<IOptions[]>([])
    const [organizationOptions, setOrganizationOptions] = useState<IOptions[]>([])
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
        fetchMemoryTypes();
        fetchOrganizations();
        fetchEnvironmentTypes();
    }, [])


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

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPagination({ ...pagination, page: newPage, })
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let pageSz = parseInt(event.target.value, 10);
        setPagination({ ...pagination, page: 0, pageSize: pageSz })
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };


    useEffect(() => {
        if (id) {
            getMemoryHistory(pagination, id)
                .then((response: AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>) => {
                    setRows(response.data.data.data)
                    setTotalItemCount(response.data.data.totalCount)
                })
                .catch(err => {
                    console.log('error', err)
                });
        }
    }, [pagination])

    useEffect(() => {
        setHistoryOf(rows.find(s => s.id === id))
    }, [rows])

    useEffect(() => {
        if (apiResponse && !apiResponse?.success) {
            const message = apiResponse?.message;
            console.log('error message', message)
        }
    }, [apiResponse]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
                <Typography
                    sx={{ flex: '1 1 100%', mb: 0 }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Memory History
                </Typography>
                {
                    pinCodeChecked &&
                    <Stack alignItems='stretch' direction='row'>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h5"
                            id="tableTitle"
                            component="div"
                        >
                            <em>{historyOf?.title}</em>
                        </Typography>

                        <CountDownTimer targetDate={dateOfExpiration} ></CountDownTimer>
                    </Stack>
                }
                {
                    !pinCodeChecked ? <>
                        <Skeleton variant='rectangular' width='100%' height='400px' animation='pulse' ></Skeleton>
                        <PinCodeDialog setPinCodeChecked={setPinCodeChecked} open={!pinCodeChecked} pinCodeExpiration={pinCodeExpiration} setPinCodeExpiration={setPinCodeExpiration}></PinCodeDialog>
                    </>
                        :
                        <>
                            {
                                rows.map((row, index) => {
                                    let prevRow = rows[index + 1];
                                    return (<MemoryHistoryItem memory={row} prevMemory={prevRow} organizationOptions={organizationOptions} memoryTypeOptions={memoryTypeOptions} environmentTypeOptions={environmentTypeOptions} ></MemoryHistoryItem>)
                                })
                            }

                            <TablePagination
                                rowsPerPageOptions={[2,4, 10, 20, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={totalItemCount}
                                rowsPerPage={pagination.pageSize}
                                page={pagination.page}
                                component="div"
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </>
                }

            </Paper>
            <Stack direction='column'>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />
                <Button onClick={() => navigate('/memory')}  >Back To List</Button>
            </Stack>
        </Box >
    );
}

export default MemoryHistory