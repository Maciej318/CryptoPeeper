import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { CryptoState } from '../../CryptoContext';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../fierbase";

function SignUp({ handleClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: 'Passwords do not match',
        type: 'error',
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose()
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      });
      return;
    }

  };

  const useStyles = makeStyles({
    loginButton: {
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      backgroundColor: '#f0be2f',
      padding: 8,
      fontFamily: "Jost",
      cursor: 'pointer',
      "&:hover, &:focus": {
        background: '#ad8a24',
        transition: 'background-color 0.9s ease',
      },
    },
    input: {
      '& input:valid + fieldset': {
        borderColor: '#ad8a24',
        borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
        borderColor: '#ad8a24',
        padding: '4px !important',
      },
      '& input:valid:hover + fieldset': {
        borderColor: '#ad8a24',
      },
    },
  });

  const classes = useStyles();

  return (
    <Box p={3} style={{ display: "flex", flexDirection: "column", gap: '20px' }}>
      <TextField variant='outlined' type='email' label="Enter E-mail" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth className={classes.input} />
      <TextField variant='outlined' type='password' label="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth className={classes.input} />
      <TextField variant='outlined' type='password' label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth className={classes.input} />
      <Button variant='outlined' size='large' className={classes.loginButton} onClick={handleSubmit}>
        Sign Up
      </Button>
    </Box>
  );
}

export default SignUp;
