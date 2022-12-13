import { Button, SortDirection } from '@mui/material'
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import React from 'react'

interface OrderButtonProps {
    colum: string;
    columHeader: string;
    orderBy: string;
    order: SortDirection;
}

const OrderButton = (props: OrderButtonProps) => {
    return (
        <Button sx={{ width: '100%', height: '100%', p: 0, m:0 }} color='inherit' endIcon={
            props.orderBy === props.colum ?
                <> {props.order === 'asc' ? <SouthIcon /> : <NorthIcon />}</>
                :
                <SouthIcon color='disabled' />
        }
        >
            {props.columHeader}
        </Button>
    )
}

export default OrderButton