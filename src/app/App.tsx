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
import {useAppDispatch, useAppSelector} from "../state/store";
import {TodolistList} from '../features/TodolistsList/TodolistsList';
import {CustomizedSnackbars} from "../components/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/auth/Login";
import {initializeAppTC} from "./app-reducer";
import Button from "@mui/material/Button";
import {logoutTC} from "../features/auth/authReducer";
import {appSelectors} from "./index";
import {authSelectors} from "../features/auth";
import {fetchTodolistTC} from "../features/TodolistsList/todolist-action";





function App() {

    const dispatch = useAppDispatch();
    const status = useAppSelector(appSelectors.selectStatus)
    const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
    const isLoginIn = useAppSelector(authSelectors.selectIsLoggedIn)

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
