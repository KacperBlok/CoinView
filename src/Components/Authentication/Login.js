import React from 'react'
import { useState } from 'react'
import { Box, TextField, Button } from '@material-ui/core'

const Login = ({handleClose}) => {
  
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = () => {
        
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
            >Sign in
                
            </Button>
        </Box>
    )
}

         

export default Login