import { makeStyles } from '@material-ui/core'
import React from 'react'

function SelectButton({ children, selected, onClick }) {
    const useStyles = makeStyles({
    SelectButton: {
        border: '1px solid #f0be2f',
        borderRadius: 5,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: "Jost",
        cursor: 'pointer',
        backgroundColor: selected ? '#f0be2f' : "",
        color: selected ? 'black' : "",
        fontweight: selected ? 700 : 500,
        "&:hover" : {
            backgroundColor: '#f0be2f',
            color: "black",
            transition: 'background-color 0.5s ease',
        },
        width: "22%",
    }
    });

    const classes = useStyles();

  return (
    <span onClick={onClick} className={classes.SelectButton}>{children}</span>
  )
}

export default SelectButton