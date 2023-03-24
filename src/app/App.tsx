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
import {useAppSelector} from "../state/store";
import {CustomizedSnackbars} from "../components/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {appReducer} from "./app-reducer";
import Button from "@mui/material/Button";
import {appAsyncAction, appSelectors} from "./index";
import {authActions, authSelectors, Login} from "../features/auth";
import {TodolistList} from "../features/TodolistsList";
import { useActions } from '../utils/redux-utils';



function App() {

    const status = useAppSelector(appSelectors.selectStatus)
    const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
    const isLoginIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const {initializeAppTC} = useActions(appAsyncAction)
    const {logoutTC} = useActions(authActions)


    useEffect(() => {
        initializeAppTC()
    }, [])

    const logoutHandler = useCallback(() => {
        logoutTC()
    }, [])

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
