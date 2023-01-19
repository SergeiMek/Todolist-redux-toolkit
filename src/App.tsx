import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {fetchTodolistTC} from "./state/todolists-reducer";
import {useAppDispatch, useAppSelector} from "./state/store";
import {TodolistList} from './components/TodolistsList';
import {CustomizedSnackbars} from "./components/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./components/Login";
import {initializeAppTC} from "./state/app-reducer";
import Button from "@mui/material/Button";
import {logoutTC} from "./state/authReducer";


function App() {

    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoginIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler =useCallback( ()=> {
        dispatch(logoutTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }



    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton>
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoginIn && <Button color='inherit' onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404 .Page not found</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <CustomizedSnackbars/>
        </div>
    );
}


export default App;
