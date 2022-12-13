import { Toolbar, alpha, Typography, Tooltip, IconButton, Link } from "@mui/material";
import { EnhancedTableToolbarProps } from "./props/EnhancedTableToolbar";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, addNewItemUrl, showButtons } = props;

    const navigate = useNavigate();
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            )
                :
                <></>}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <>
                    {
                        showButtons && (
                            <>
                                <Tooltip title="Filter list">
                                    <IconButton>
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>
                                <Link
                                    underline="none"
                                    color='inherit'
                                    onClick={() => navigate(addNewItemUrl)}
                                >
                                    <IconButton >
                                        <AddIcon />
                                    </IconButton>
                                </Link>
                            </>
                        )
                    }
                </>
            )}
        </Toolbar>
    );
}
export default EnhancedTableToolbar;