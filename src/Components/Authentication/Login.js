import React from 'react'
import { useState } from 'react'
import { Box, TextField, Button } from '@material-ui/core'
import { CryptoState } from '../../CryptoContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase';

const Login = ({handleClose}) => {
  
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const { setAlert} = CryptoState();

    const handleSubmit = async () => {
        if(!email || !password){
            setAlert({
                open: true,
                message: "Please fill all the fields",
                type: "error",
            });
            return;
        }
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setAlert({
                open: true,
                message: `Login Successful. Welcome ${result.user.email}`,
                type: "success",
            });
            handleClose();
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
            return;
        }
    }
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
            <Button
                variant="contained"
                color="primary"
                size='large'
                style={{backgroundColor: "gold", color: "black"}}
                onClick= {handleSubmit}
            >Login
                
            </Button>
        </Box>
    )
}

         

export default Login