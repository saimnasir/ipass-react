import React, { useEffect, useState } from 'react'
import { createOrganization, getOrganization, getOrganizations, updateOrganization } from '../../../network/services/organizationService'
import OrganizationModelInit, { OrganizationModel } from '../../../models/organization/organization/organizationModel'
import { FinalResponse } from '../../../models/final-response'
import { PaginationFilterModel, PaginationFilterModelAllInit, PaginationFilterModelInit } from '../../../models/paginationModel'
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
import { OrganizationModelEnhancedTableProps } from '../../../library/props/EnhancedTable'
import { OrganizationTypeModel } from '../../../models/organization/organization-type/organizationTypeModel'
import { getOrganizationTypes } from '../../../network/services/organizationTypeService'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { blue } from '@mui/material/colors'
import OrganizationEditor from './OrganizationEditor'
import { SingleResponse } from '../../../models/single-response'
import { SubmitHandler } from 'react-hook-form'
import { Edit } from '@mui/icons-material'
import { IOptions } from '../../../context/FormSelect'
import { Action } from '../../../models/enums/Actions'

const dataCells: readonly DataCell<OrganizationModel>[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
    minWidth: 170
  },
  {
    id: 'organizationTypeId',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Organization Type ',
    minWidth: 170,
    getNameFrom(items, id, property) {
      let item = items.filter(item => item.value === id)[0];
      return !item ? id : item[property];
    },
  },
  {
    id: 'parentOrganizationId',
    numeric: false,
    disablePadding: false,
    align: 'center',
    label: 'Parent Organization',
    minWidth: 170,
    getNameFrom(items, id, property) {
      let item = items.filter(item => item.value === id)[0];
      return !item ? id : item[property];
    },
  }
];


function EnhancedTableHead(props: OrganizationModelEnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onOpenEditor } =
    props;
  const createSortHandler =
    (property: keyof OrganizationModel) => (event: React.MouseEvent<unknown>) => {
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

const OrganizationList = () => {
  const [rows, setRows] = useState<OrganizationModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [apiResponse, setApiResponse] = useState<any>()
  const [totalItemCount, setTotalItemCount] = useState<number>(0)
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [pagination, setPagination] = useState<PaginationFilterModel>(PaginationFilterModelInit)
  const [dense, setDense] = React.useState(false);
  const [organizationModel, setOrganizationModel] = useState<OrganizationModel>(OrganizationModelInit)
  const [action, setAction] = useState<Action>(Action.None)
  const [parentOrganizationOptions, setParentOrganizationOptions] = useState<IOptions[]>([])
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<IOptions[]>([])

  useEffect(() => {
    loadTable()
  }, [pagination])

  const loadTable = () => {
    fetchParentOrganizations()
    fetchOrganizationTypeOptions()
    getOrganizations(pagination)
      .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>) => {
        setRows(response.data.data.data)
        setTotalItemCount(response.data.data.totalCount)
      })
      .catch(err => {
        console.log('error', err)
      });
  }

  const fetchParentOrganizations = () => {
    getOrganizations(PaginationFilterModelAllInit)
      .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationModel>>>) => {
        let options = response.data.data.data.map((optionData) => {
          let option: IOptions = {
            text: optionData.title,
            value: optionData.id
          }
          return option
        })
        setParentOrganizationOptions(options)
      })
      .catch(err => {
        console.log('error', err)
      });
  }
  const fetchOrganizationTypeOptions = () => {
    if (organizationTypeOptions.length === 0) {
      getOrganizationTypes(PaginationFilterModelAllInit)
        .then((response: AxiosResponse<FinalResponse<ListResponse<OrganizationTypeModel>>>) => {
          let options = response.data.data.data.map((optionData) => {
            let option: IOptions = {
              text: optionData.title,
              value: optionData.id
            }
            return option
          })
          setOrganizationTypeOptions(options)
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
    property: keyof OrganizationModel,
  ) => {
    const isAsc = pagination.sortBy === property && pagination.sortType === 'asc';
    let newSortType: SortDirection = isAsc ? 'desc' : 'asc';
    setPagination({ ...pagination, sortType: newSortType, sortBy: property })
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const getCellValue = (rowData: OrganizationModel, cell: DataCell<OrganizationModel>, value: string | boolean | undefined) => {

    if (cell.format && typeof value === 'number') {
      return cell.format(value)
    }

    if (cell.getNameFrom) {
      switch (cell.id) {
        case 'organizationTypeId':
          return cell.getNameFrom(organizationTypeOptions, value, 'text')
        case 'parentOrganizationId':
          return cell.getNameFrom(parentOrganizationOptions, value, 'text')
      }
    }
    return value;
  }

  useEffect(() => {
    if (organizationModel.id) {
      setLoading(true)
      getOrganization(organizationModel.id)
        .then((response: AxiosResponse<FinalResponse<SingleResponse<OrganizationModel>>>) => {
          setApiResponse(response.data)
          setOrganizationModel(response.data.data.data)
        })
        .catch(err => {
          console.log('error', err)
        }).finally(() => {
          setLoading(false)
        });
    } else {
      setOrganizationModel(OrganizationModelInit)
    }
  }, [action])

  const onUpdate = (formData: OrganizationModel) => {
    updateOrganization(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            setLoading(false)
            setOrganizationModel(OrganizationModelInit)
            loadTable()
          }, 500)
        }
      }).catch(err => {
        console.log('error', err)
      });
  }

  const onCreate = (formData: OrganizationModel) => {
    createOrganization(formData)
      .then((response: AxiosResponse<FinalResponse<boolean>>) => {
        setApiResponse(response.data)
        if (response.data.success) {
          setTimeout(() => {
            setAction(Action.None)
            setOrganizationModel(OrganizationModelInit)
            setPagination({ ...pagination, sortBy: 'created', sortType: 'desc' })
            setLoading(false)
          }, 500)
        }
      })
      .catch(err => {
        console.log('error', err)
        setLoading(false)
      });
  }

  const onSubmitHandler: SubmitHandler<OrganizationModel> = (formData) => {
    setLoading(true)
    setOrganizationModel(formData)
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
    setOrganizationModel({ ...OrganizationModelInit, id: id })
  }

  const handleOpenNew = () => {
    setAction(Action.Create)
    setOrganizationModel(OrganizationModelInit)

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
          Organizations
        </Typography>
        <EnhancedTableToolbar
          numSelected={selected.length}
          addNewItemUrl='/organization/new'
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
                      <TableCell >
                        <Checkbox
                          color="primary"
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
      <OrganizationEditor
        open={action !== Action.None}
        organizationModel={organizationModel}
        onSubmitHandler={onSubmitHandler}
        loading={loading}
        onHandleClose={handleCloseDialog}
        action={action}
        parentOrganizationOptions={parentOrganizationOptions}
        organizationTypeOptions={organizationTypeOptions}
      />
    </Box>
  );
}

export default OrganizationList