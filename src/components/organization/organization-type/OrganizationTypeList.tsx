import React, { useEffect, useState } from 'react'
import { FinalResponse } from '../../../models/final-response'
import { PaginationFilterModel, PaginationFilterModelInit } from '../../../models/paginationModel'
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
import { OrganizationTypeModelEnhancedTableProps } from '../../../library/props/EnhancedTable'
import OrganizationTypeModelInit, { OrganizationTypeModel } from '../../../models/organization/organization-type/organizationTypeModel'
import { createOrganizationType, getOrganizationType, getOrganizationTypes, updateOrganizationType } from '../../../network/services/organizationTypeService'
import { Edit } from '@mui/icons-material' 
import { blue } from '@mui/material/colors'
import OrganizationTypeEditor, { CrudAction } from './OrganizationTypeEditor'
import { SubmitHandler } from 'react-hook-form'
import { SingleResponse } from '../../../models/single-response'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const dataCells: readonly DataCell<OrganizationTypeModel>[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
    align: 'center'
  }
];

function EnhancedTableHead(props: OrganizationTypeModelEnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onOpenEditor } =
    props;
  const createSortHandler =
    (property: keyof OrganizationTypeModel) => (event: React.MouseEvent<unknown>) => {
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

const OrganizationTypeList = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [apiResponse, setApiResponse] = useState<any>()
  const [rows, setRows] = useState<OrganizationTypeModel[]>([])
  const [totalItemCount, setTotalItemCount] = useState<number>(0)
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [pagination, setPagination] = useState<PaginationFilterModel>(PaginationFilterModelInit)
  const [dense, setDense] = React.useState(false);
  const [organizationTypeModel, setOrganizationTypeModel] = useState<OrganizationTypeModel>(OrganizationTypeModelInit)
  const [action, setAction] = useState<CrudAction>(undefined)

  useEffect(() => {
    loadTable()
  }, [pagination])

  const loadTable = () => {
    getOrganizationTypes(pagination)
      .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationTypeModel>>>) => {
        setRows(response.data.data.data)
        setTotalItemCount(response.data.data.totalCount)
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
    property: keyof OrganizationTypeModel,
  ) => {
    const isAsc = pagination.sortBy === property && pagination.sortType === 'asc';
    let newSortType: SortDirection = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortType: newSortType, sortBy: property })
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;


  const getCellValue = (rowData: OrganizationTypeModel, cell: DataCell<OrganizationTypeModel>, value: string | boolean | undefined) => {

    if (cell.format && typeof value === 'number') {
      return cell.format(value)
    }
    return value;
  }

  useEffect(() => {
    if (organizationTypeModel.id) {
      setLoading(true)
      getOrganizationType(organizationTypeModel.id)
        .then((response: AxiosResponse<FinalResponse<SingleResponse<OrganizationTypeModel>>>) => {
          setApiResponse(response.data)
          setOrganizationTypeModel(response.data.data.data)
        })
        .catch(err => {
          console.log('error', err)
        }).finally(() => {
          setLoading(false)
        });
    } else {
      setOrganizationTypeModel(OrganizationTypeModelInit)
    }
  }, [action])

  const onUpdate = (formData: OrganizationTypeModel) => {
    updateOrganizationType(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(undefined)
            setOrganizationTypeModel(OrganizationTypeModelInit)
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

  const onCreate = (formData: OrganizationTypeModel) => {
    createOrganizationType(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(undefined)
            setOrganizationTypeModel(OrganizationTypeModelInit)
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

  
  const onSubmitHandler: SubmitHandler<OrganizationTypeModel> = (formData) => {
    setLoading(true)
    setOrganizationTypeModel(formData)
    if (action === 'edit') {
      onUpdate(formData)
    } else if (action === 'new') {
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
    setAction('edit')
    setOrganizationTypeModel({ ...OrganizationTypeModelInit, id: id })
  }

  const handleOpenNew = () => {
    setAction('new')
    setOrganizationTypeModel(OrganizationTypeModelInit)

  }
  const handleCloseDialog = () => {
    setAction(undefined)
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
          Organization Types
        </Typography>
        <EnhancedTableToolbar
          numSelected={selected.length}
          addNewItemUrl='/organization/type/new'
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
      <OrganizationTypeEditor
        open={action !== undefined}
        organizationTypeModel={organizationTypeModel}
        onSubmitHandler={onSubmitHandler}
        loading={loading}
        onHandleClose={handleCloseDialog}
        action={action}
      />
    </Box>
  );
}

export default OrganizationTypeList