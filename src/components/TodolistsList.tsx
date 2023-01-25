import {useAppDispatch, useAppSelector} from "../state/store";
import React, {useCallback, useEffect} from "react";
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistTC, removeTodolistTC} from "../state/todolists-reducer";
import {CircularProgress, Grid, Paper} from "@mui/material";
import {AddItemForm} from "./AddItemForm";
import {Todolist} from "./Todolist";
import {Navigate} from "react-router-dom";

export const TodolistList = () => {
    const dispatch = useAppDispatch();
    const todolists = useAppSelector(state => state.todolists)
    const entityStatus = useAppSelector(state => state.app.status)
    const isLoginIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoginIn) {
            return
        }
        dispatch(fetchTodolistTC())
    }, [])


    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(addTodolistTC({todolistTitle}))
    }, [])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC({todolistId}))
    }, [])

    const changeTodolistTitle = useCallback((todolistTitle: string, todolistId: string) => {
        dispatch(changeTodolistTitleTC({todolistTitle,todolistId}))
    }, [])

    if (!isLoginIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist} disabled={entityStatus === 'loading'}/>
        </Grid>
        <Grid container spacing={3}>
            {todolists.map(tl => {
                return <Grid item>
                    <Paper style={{padding: "20px"}}>
                        <Todolist
                            key={tl.id}
                            id={tl.id}
                            title={tl.title}
                            filter={tl.filter}
                            removeTodolist={removeTodolist}
                            changeTodolistTitle={changeTodolistTitle}
                            entityStatus={tl.entityStatus}
                        />
                    </Paper>
                </Grid>
            })}
        </Grid>
    </>
}