import React, { useEffect, useState } from 'react'
import { createMemory, getMemories, getMemory, updateMemory } from '../../../network/services/memoryService'
import { getMemoryTypes } from '../../../network/services/memoryTypeService'
import MemoryModelInit, { MemoryModel } from '../../../models/memory/memory/memoryModel'
import { FinalResponse } from '../../../models/final-response'
import { PaginationDecodeModel, PaginationDecodeModelInit, PaginationFilterModelAllInit, PaginationTenantFilterModelInit } from '../../../models/paginationModel'
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box,
  SortDirection, TablePagination, IconButton, Typography, Stack
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { ListResponse } from '../../../models/list-response'
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { DataCell } from '../../../library/DataCell'
import TablePaginationActions from '../../../library/TablePaginationActions'
import EnhancedTableToolbar from '../../../library/EnhancedTableToolbar'
import { MemoryModelEnhancedTableProps } from '../../../library/props/EnhancedTable'
import { MemoryTypeModel } from '../../../models/memory/memory-type/memoryTypeModel'
import { getOrganizations } from '../../../network/services/organizationService'
import { getEnvironmentTypes } from '../../../network/services/environmentTypeService'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { Edit, History, RemoveRedEye } from '@mui/icons-material'
import { blue, grey } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'
import { Action } from '../../../models/enums/Actions'
import { IOptions } from '../../../context/FormSelect'
import { SingleResponse } from '../../../models/single-response'
import { SubmitHandler } from 'react-hook-form'
import MemoryEditor from './MemoryEditor'
import PinCodeDialog from './PinCodeDialog'
import { useTenant } from '../../../context/TenantContext'
import { OrganizationModel } from '../../../models/organization/organization/organizationModel'
import { EnvironmentTypeModel } from '../../../models/environment-type/environmentTypeModel'


const dataCells: readonly DataCell<MemoryModel>[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
    minWidth: 100,
    onDetail: false
  },
  {
    id: 'organizationId',
    numeric: false,
    disablePadding: true,
    label: 'Organization',
    minWidth: 100,
    getNameFrom(items, id, property) {
      let item = items.filter(item => item.value === id)[0];
      return !item ? id : item[property];
    },
    onDetail: false
  },
  {
    id: 'memoryTypeId',
    numeric: false,
    disablePadding: true,
    label: 'Memory Type',
    minWidth: 120,
    getNameFrom(items, id, property) {
      let item = items.filter(item => item.value === id)[0];
      return !item ? id : item[property];
    },
    onDetail: false
  },
  {
    id: 'environmentTypeId',
    numeric: false,
    disablePadding: true,
    label: 'Environment Type',
    minWidth: 100,
    getNameFrom(items, id, property) {
      let item = items.filter(item => item.value === id)[0];
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
    minWidth: 100,
    onDetail: false
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Email',
    minWidth: 120,
    onDetail: false
  },
  {
    id: 'port',
    numeric: true,
    disablePadding: false,
    align: 'right',
    label: 'Port',
    format: (value: number) => value.toLocaleString('tr-TR'),
    minWidth: 120,
    onDetail: true
  },
  {
    id: 'password',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Password',
    minWidth: 120,
    onDetail: false
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Description',
    minWidth: 120,
    onDetail: true
  },

  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Created At',
    minWidth: 120,
    onDetail: true
  }
];

function EnhancedTableHead(props: MemoryModelEnhancedTableProps) {
  const { onSelectAllClick, toggleExpandedAll, expandAll, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof MemoryModel) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead >
      <TableRow >
        <TableCell sx={{ bgcolor: blue[50] }}>
          <Stack spacing={1} direction='row'>
            <IconButton
              aria-label="expand row"
              color='secondary'
              size="small"
              onClick={toggleExpandedAll}
            >
              {expandAll ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </Stack>
        </TableCell>
        {dataCells.filter(f => !f.onDetail).map((cell) => (
          <TableCell
            key={cell.id}
            align={cell.align ? cell.align : (cell.numeric ? 'right' : 'left')}
            padding={cell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === cell.id ? order : false}
            style={{ minWidth: cell.minWidth, backgroundColor: blue[50] }}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={orderBy === cell.id && order ? order : 'asc'}
              onClick={createSortHandler(cell.id)}
            >
              {cell.label}
              {orderBy === cell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ bgcolor: blue[50] }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}
const MemoryList = () => {
  const navigate = useNavigate();

  const { tenant } = useTenant();

  const [rows, setRows] = useState<MemoryModel[]>([])
  const [totalItemCount, setTotalItemCount] = useState<number>(0)
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  let initialPagination = PaginationDecodeModelInit;
  initialPagination.tenantId = tenant;
  const [pagination, setPagination] = useState<PaginationDecodeModel>(initialPagination)
  const [dense, setDense] = React.useState(false);

  const [memoryTypes, setMemoryTypes] = useState<IOptions[]>([])
  const [organizations, setOrganizations] = useState<IOptions[]>([])
  const [environmentTypes, setEnvironmentTypes] = useState<IOptions[]>([])
  const [expandAll, setExpandAll] = useState<boolean>(false)
  const [action, setAction] = useState<Action>(Action.None)
  const [memoryModel, setMemoryModel] = useState<MemoryModel>(MemoryModelInit)
  const [loading, setLoading] = useState<boolean>(false)
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
    loadTable()
  }, [pagination, pinCodeChecked])

  useEffect(() => {
    setPagination({ ...pagination, tenantId: tenant })
  }, [tenant])


  const loadTable = () => {
    fetchMemoryTypes()
    fethOrganizations()
    fetchEnvironmentTypes()
  }

  const fetchMemoryTypes = () => {
    
  let memoryTypePagination = PaginationTenantFilterModelInit;
  memoryTypePagination.tenantId = tenant;
    getMemoryTypes(memoryTypePagination)
      .then((response: AxiosResponse<FinalResponse<ListResponse<MemoryTypeModel>>>) => {
        let options = response.data.data.data.map((optionData) => {
          let option: IOptions = {
            text: optionData.title,
            value: optionData.id
          }
          return option
        })
        setMemoryTypes(options)
      })
      .catch(err => {
        console.log('error', err)
      });

  }

  const fethOrganizations = () => {
    getOrganizations(PaginationFilterModelAllInit)
      .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>) => {
        let options = response.data.data.data.map((optionData) => {
          let option: IOptions = {
            text: optionData.title,
            value: optionData.id
          }
          return option
        })
        setOrganizations(options)
      })
      .catch(err => {
        console.log('error', err)
      });

  }

  const fetchEnvironmentTypes = () => {
    getEnvironmentTypes(PaginationFilterModelAllInit)
      .then((response: AxiosResponse<FinalResponse<ListResponse<EnvironmentTypeModel>>>) => {
        let options = response.data.data.data.map((optionData) => {
          let option: IOptions = {
            text: optionData.title,
            value: optionData.id
          }
          return option
        })
        setEnvironmentTypes(options)
      })
      .catch(err => {
        console.log('error', err)
      });

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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof MemoryModel,
  ) => {
    const isAsc = pagination.sortBy === property && pagination.sortType === 'asc';
    let newSortType: SortDirection = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortType: newSortType, sortBy: property })
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  useEffect(() => {
    if (pagination.tenantId) {
      getMemories(pagination)
        .then((response: AxiosResponse<FinalResponse<ListResponse<MemoryModel>>>) => {
          setRows(response.data.data.data)
          setTotalItemCount(response.data.data.totalCount)
        })
        .catch(err => {
          console.log('error', err)
        });
    }
  }, [pagination])

  const getCellValue = (rowData: MemoryModel, cell: DataCell<MemoryModel>, value: string | boolean | undefined) => {

    if (rowData.isUEmailSecure && cell.id == 'email') {
      return (<LockOpenIcon color='success' onClick={() => navigate(`/memory/read/${rowData.id}`)} />)
    }
    if (rowData.isUserNameSecure && cell.id == 'userName') {
      return (<LockOpenIcon color='success' onClick={() => navigate(`/memory/read/${rowData.id}`)} />)
    }
    if (rowData.isPortSecure && cell.id == 'port') {
      return (<LockOpenIcon color='success' onClick={() => navigate(`/memory/read/${rowData.id}`)} />)
    }
    if (cell.id == 'password') {
      return (<LockOpenIcon color='success' onClick={() => navigate(`/memory/read/${rowData.id}`)} />)
    }

    if (cell.format && typeof value === 'number') {
      return cell.format(value)
    }

    if (cell.getNameFrom) {
      switch (cell.id) {
        case 'memoryTypeId':
          return cell.getNameFrom(memoryTypes, value, 'title')
        case 'organizationId':
          return cell.getNameFrom(organizations, value, 'title')
        case 'environmentTypeId':
          return cell.getNameFrom(environmentTypes, value, 'title')
      }
    }
    return value;
  }

  const toggleExpanded = (newRow: MemoryModel) => {
    newRow.isExpanded = !newRow.isExpanded
    const newRows = rows.map((row) => {
      if (newRow.id === row.id) {
        return newRow
      }
      return row
    });
    setRows(newRows)
  }

  const toggleExpandedAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newExpandAll = !expandAll
    setExpandAll(newExpandAll)
  };

  useEffect(() => {
    const newRows = rows.map((row) => {
      row.isExpanded = expandAll
      return row
    });
    setRows(newRows)
  }, [expandAll])


  useEffect(() => {
    if (memoryModel.id) {
      setLoading(true)
      getMemory(memoryModel.id, true)
        .then((response: AxiosResponse<FinalResponse<SingleResponse<MemoryModel>>>) => {
          setApiResponse(response.data)
          let memory = response.data.data.data;
          memory.confirmPassword = memory.password;
          setMemoryModel(memory)
        })
        .catch(err => {
          console.log('error', err)
        }).finally(() => {
          setLoading(false)
        });
    } else {
      setMemoryModel(MemoryModelInit)
    }
  }, [action])


  const onUpdate = (formData: MemoryModel) => {
    updateMemory(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            setLoading(false)
            setMemoryModel(MemoryModelInit)
            loadTable()
          }, 500)
        }
      }).catch(err => {
        console.log('error', err)
      });
  }

  const onCreate = (formData: MemoryModel) => {
    createMemory(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            // setMemoryModel(MemoryModelInit)
            setPagination({ ...pagination, sortBy: 'createdAt', sortType: 'desc' })
            setLoading(false)
          }, 500)
        }
      })
      .catch(err => {
        console.log('error', err)
        setLoading(false)
      });
  }

  const onSubmitHandler: SubmitHandler<MemoryModel> = (formData) => {
    setLoading(true)  
    setMemoryModel(formData)
    if (action === Action.Update) {
      onUpdate(formData)
    } else if (action === Action.Create) {
      onCreate(formData)
    }
  };

  useEffect(() => {
    if (apiResponse) {
      if (!apiResponse.success) {
        const message = apiResponse?.message;
        console.log('error message', message)
      }
    }
  }, [apiResponse]);

  const handleOpenEdit = (id: string) => {
    setAction(Action.Update)
    setMemoryModel({ ...MemoryModelInit, id: id })
  }

  const handleOpenNew = () => {
    setAction(Action.Create)
    setMemoryModel(MemoryModelInit)

  }
  const handleCloseDialog = () => {
    setAction(Action.None)
  }

  return (
    <Box sx={{ width: '100%' }}>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography
          sx={{ flex: '1 1 100%', mb: 1 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Memories
        </Typography>
        <EnhancedTableToolbar
          numSelected={selected.length}
          addNewItemUrl='/memory/new'
          showButtons={true} />
        <TableContainer component={Paper}>
          <Table
            stickyHeader sx={{ minWidth: 500 }}
            size={dense ? 'small' : 'medium'}
            aria-label="custom pagination table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={pagination.sortType}
              orderBy={pagination.sortBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={totalItemCount}
              expandAll={expandAll}
              toggleExpandedAll={toggleExpandedAll}
            />
            <TableBody  >
              {
                rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <>
                      <TableRow
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell>
                          <Stack spacing={1} direction='row'>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleExpanded(row)}
                            >
                              {row.isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                            <Checkbox
                              color="secondary"
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, row.id)}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </Stack>
                        </TableCell>
                        {dataCells.filter(f => !f.onDetail).map((cell) => {
                          const value = row[cell.id];
                          return (
                            <TableCell
                              key={cell.id}
                              align={cell.align ? cell.align : (cell.numeric ? 'right' : 'left')}
                              padding={cell.disablePadding ? 'none' : 'normal'}
                            >
                              {
                                getCellValue(row, cell, value)
                              }
                            </TableCell>
                          );
                        })}
                        <TableCell  >
                          <Stack spacing={1} direction='row'>
                            <RemoveRedEye color='success' onClick={() => navigate(`/memory/read/${row.id}`)} />
                            <Edit color='info' onClick={() => handleOpenEdit(row.id)} />
                            <History color='secondary' onClick={() => navigate(`/memory/history/${row.id}`)} />
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: grey[100] }}>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                          <Collapse in={row.isExpanded} timeout="auto" unmountOnExit >
                            <Box sx={{ margin: 1, bgcolor: grey[100] }}>
                            </Box>
                            <Table size="small" aria-label="purchases" >
                              <TableHead>
                                <TableRow>
                                  {
                                    dataCells.filter(f => f.onDetail).map((cell) =>
                                    (
                                      <TableCell
                                        key={cell.id}
                                        align={cell.align ? cell.align : (cell.numeric ? 'right' : 'left')}
                                        padding={cell.disablePadding ? 'none' : 'normal'}
                                      >
                                        {cell.label}
                                      </TableCell>
                                    ))
                                  }
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow >
                                  {dataCells.filter(f => f.onDetail).map((cell) => {
                                    const value = row[cell.id];
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        align={cell.align ? cell.align : (cell.numeric ? 'right' : 'left')}
                                        padding={cell.disablePadding ? 'none' : 'normal'}
                                      >
                                        {
                                          getCellValue(row, cell, value)
                                        }
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
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
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />

      <PinCodeDialog setPinCodeChecked={setPinCodeChecked} open={!pinCodeChecked && action !== Action.None} pinCodeExpiration={pinCodeExpiration} setPinCodeExpiration={setPinCodeExpiration}></PinCodeDialog>

      <MemoryEditor
        open={action !== Action.None && pinCodeChecked}
        memoryModel={memoryModel}
        onSubmitHandler={onSubmitHandler}
        loading={loading}
        onHandleClose={handleCloseDialog}
        action={action}
        organizationOptions={organizations}
        memoryTypeOptions={memoryTypes}
        environmentTypeOptions={environmentTypes}
        dateOfExpiration={dateOfExpiration}
      />
    </Box >
  );
}

export default MemoryList