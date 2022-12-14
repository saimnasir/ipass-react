import React, { useEffect, useState } from 'react'
import { FinalResponse } from '../../../models/final-response'
import { PaginationTenantFilterModel, PaginationTenantFilterModelInit } from '../../../models/paginationModel'
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Box,
  SortDirection, TablePagination, Typography, Button
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
import { MemoryTypeModelEnhancedTableProps } from '../../../library/props/EnhancedTable'
import MemoryTypeModelInit, { MemoryTypeModel } from '../../../models/memory/memory-type/memoryTypeModel'
import { createMemoryType, getMemoryType, getMemoryTypes, updateMemoryType } from '../../../network/services/memoryTypeService'
import { Edit } from '@mui/icons-material'
import { blue } from '@mui/material/colors'
import MemoryTypeEditor from './MemoryTypeEditor'
import { SubmitHandler } from 'react-hook-form'
import { SingleResponse } from '../../../models/single-response'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Action } from '../../../models/enums/Actions'
import { useTenant } from '../../../context/TenantContext'

const dataCells: readonly DataCell<MemoryTypeModel>[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
    align: 'center'
  }
];

function EnhancedTableHead(props: MemoryTypeModelEnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onOpenEditor } =
    props;
  const createSortHandler =
    (property: keyof MemoryTypeModel) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ bgcolor: blue[50], width: 50 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {dataCells.map((cell) => (
          <TableCell sx={{ bgcolor: blue[50] }}
            key={cell.id}
            align={cell.align ? cell.align : (cell.numeric ? 'right' : 'left')}
            padding={cell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === cell.id ? order : false}
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
        <TableCell sx={{ bgcolor: blue[50], width: 50 }}>
          <Button onClick={onOpenEditor} >
            <AddCircleOutlineIcon color='info' fontSize='large' />
          </Button>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}

const MemoryTypeList = () => {
  const { tenant } = useTenant();

  const [loading, setLoading] = useState<boolean>(false)
  const [apiResponse, setApiResponse] = useState<any>()
  const [rows, setRows] = useState<MemoryTypeModel[]>([])
  const [totalItemCount, setTotalItemCount] = useState<number>(0)
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  let initialPagination = PaginationTenantFilterModelInit;
  initialPagination.tenantId = tenant;
  const [pagination, setPagination] = useState<PaginationTenantFilterModel>(initialPagination)

  const [dense, setDense] = React.useState(false);
  const [memoryTypeModel, setMemoryTypeModel] = useState<MemoryTypeModel>(MemoryTypeModelInit)
  const [action, setAction] = useState<Action>(Action.None)

  useEffect(() => {
    setPagination({ ...pagination, tenantId: tenant })
  }, [tenant])

  useEffect(() => {
    loadTable()
  }, [pagination])

  const loadTable = () => {
    if (pagination.tenantId) {
      getMemoryTypes(pagination)
        .then((response: AxiosResponse<FinalResponse<ListResponse<MemoryTypeModel>>>) => {
          setRows(response.data.data.data)
          setTotalItemCount(response.data.data.totalCount)
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
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
    property: keyof MemoryTypeModel,
  ) => {
    const isAsc = pagination.sortBy === property && pagination.sortType === 'asc';
    let newSortType: SortDirection = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortType: newSortType, sortBy: property })
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;


  const getCellValue = (rowData: MemoryTypeModel, cell: DataCell<MemoryTypeModel>, value: string | boolean | undefined) => {

    if (cell.format && typeof value === 'number') {
      return cell.format(value)
    }
    return value;
  }

  useEffect(() => {
    if (memoryTypeModel.id) {
      setLoading(true)
      getMemoryType(memoryTypeModel.id)
        .then((response: AxiosResponse<FinalResponse<SingleResponse<MemoryTypeModel>>>) => {
          setApiResponse(response.data)
          setMemoryTypeModel(response.data.data.data)
        })
        .catch(err => {
          console.log('error', err)
        }).finally(() => {
          setLoading(false)
        });
    } else {
      setMemoryTypeModel(MemoryTypeModelInit)
    }
  }, [action])

  const onUpdate = (formData: MemoryTypeModel) => {
    updateMemoryType(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            setMemoryTypeModel(MemoryTypeModelInit)
            loadTable()
            setLoading(false)
          }, 500)
        }
      })
      .catch(err => {
        console.log('error', err)
        setLoading(false)
      });
  }

  const onCreate = (formData: MemoryTypeModel) => {
    createMemoryType(formData, tenant)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            setMemoryTypeModel(MemoryTypeModelInit)
            setPagination({ ...pagination, sortBy: 'createdAt', sortType: 'desc' })
            loadTable()
            setLoading(false)
          }, 500)
        }
      })
      .catch(err => {
        console.log('error', err)
        setLoading(false)
      });
  }


  const onSubmitHandler: SubmitHandler<MemoryTypeModel> = (formData) => {
    setLoading(true) 
    formData.tenantId = tenant;
    setMemoryTypeModel(formData)
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
    setMemoryTypeModel({ ...MemoryTypeModelInit, id: id })
  }

  const handleOpenNew = () => {
    setAction(Action.Create)
    setMemoryTypeModel(MemoryTypeModelInit)

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
          Memory Types
        </Typography>
        <EnhancedTableToolbar
          numSelected={selected.length}
          addNewItemUrl='/memory/type/new'
          showButtons={false}
        />
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
              onOpenEditor={handleOpenNew}
            />
            <TableBody  >
              {
                rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell  >
                        <Checkbox
                          color="secondary"
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.id)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {dataCells.map((cell) => {
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
                        <Button onClick={() => handleOpenEdit(row.id)} >
                          <Edit color='info' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[1, 2, 5, 10, 25, { label: 'All', value: -1 }]}
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
      <MemoryTypeEditor
        open={action !== Action.None}
        memoryTypeModel={memoryTypeModel}
        onSubmitHandler={onSubmitHandler}
        loading={loading}
        onHandleClose={handleCloseDialog}
        action={action}
      />
    </Box>
  );
}

export default MemoryTypeList