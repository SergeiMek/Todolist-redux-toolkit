import {useActions, useAppDispatch, useAppSelector} from "../../state/store";
import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist";
import {Navigate} from "react-router-dom";
import {appSelectors} from "../../app";
import {authSelectors} from "../auth";
import {selectTodolists} from "./selectors";
import {addTodolistTC, changeTodolistTitleTC, fetchTodolistTC, removeTodolistTC} from "./todolist-action";
import {todolistAction} from "./index";

export const TodolistList = () => {
    const todolists = useAppSelector(selectTodolists)
    const entityStatus = useAppSelector(appSelectors.selectStatus)
    const isLoginIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const {fetchTodolistTC,addTodolistTC,removeTodolistTC,changeTodolistTitleTC}=useActions(todolistAction)

    useEffect(() => {
        if (!isLoginIn) {
            return
        }
        fetchTodolistTC()
    }, [])


    const addTodolist = useCallback((todolistTitle: string) => {
       addTodolistTC({todolistTitle})
    }, [])

    const removeTodolist = useCallback((todolistId: string) => {
        removeTodolistTC({todolistId})
    }, [])

    const changeTodolistTitle = useCallback((todolistTitle: string, todolistId: string) => {
        changeTodolistTitleTC({todolistTitle,todolistId})
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