import React, { useState } from 'react'
import { Box, TextField, Button } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext'
const SignUp = ({handleClose}) => {
  
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
  
    const {setAlert} = CryptoState()

    const handleSubmit = () => {
        if(password!== confirmPassword){
            setAlert({
                open: true, 
                type: "error", 
                message: "Passwords do not match"})
        }else{
            setAlert({
                open: true,
                type: "success",
                message: "Account created successfully"})
        }
        return
    };

    return (
        <Box 
        padding={3}
        style={{display: "flex", flexDirection: "column", gap: "20px"}}
        >
            <TextField
                variant="outlined"
                type="email"
                label="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />
            <TextField
                variant="outlined"
                label="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                
            />
            <TextField
                variant="outlined"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                
                />
            <Button
                variant="contained"
                color="primary"
                size='large'
                style={{backgroundColor: "gold", color: "black"}}
                onClick= {handleSubmit}
            >Sign Up
                
            </Button>
        </Box>
    )
}

export default SignUp