import React, { useState } from 'react';
import { Avatar, Button, Container, CssBaseline, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Css/Login.css'
const theme = createTheme();

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const decodeToken = (encodedToken) => {
    // Decode the token when needed
    const token = atob(encodedToken); // Decode the Base64 encoded token
    return token;
  };


  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:7003/api/Authorization/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', username);
        localStorage.setItem('role', data.role);
        const role = localStorage.getItem('role');
        if (role === 'Admin') {
          const token = decodeToken(data.token);
          localStorage.setItem('token', token);
          toast.success('Welcome Admin');
          navigate('/Crud');
        } else if (role === 'Student') {
          const token = decodeToken(data.token);
          localStorage.setItem('token', token);
          toast.success('Welcome Student');
          navigate('/StudentPage');
        } else if (role === 'Professor') {
          console.log(data.userID);
          localStorage.setItem('userId', data.userID);
          localStorage.setItem('username', data.username);
          const token = decodeToken(data.token);
          localStorage.setItem('token', token);
          toast.success('Welcome Student');

          navigate('/VenueBookingProcess');
        } else {
          toast.error('Invalid username or password. Please try again.');
        }
      } else {
        toast.error('Invalid username or password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while trying to login.');
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Login
            </Button>
            <div>
              <Link to='/register' className="custom-link">
                Don't Have An Account? Sign Up Here
              </Link>      </div>
            <div>
              <Link to='/Password' className="custom-link1">
                Forgot Password
              </Link></div>

            <Typography variant="body2" color="error" align="center">
              {message}
            </Typography>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
