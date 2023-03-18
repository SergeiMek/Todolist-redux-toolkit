import {ActionCreatorsMapObject, applyMiddleware, bindActionCreators, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features/TodolistsList";
import {tasksReducer} from "../features/TodolistsList/Task";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ActionAppType, appReducer} from "../app/app-reducer";
import { authReducer} from "../features/auth";
import {configureStore} from "@reduxjs/toolkit";
import {useMemo} from "react";
import {ActionsLoginReducerType} from "../features/auth/authReducer";
import {actionsTypeTodolists} from "../features/TodolistsList/todolists-reducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer

})

export type AppRootState = ReturnType<typeof rootReducer>

//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type ActionsType = actionsTypeTodolists | ActionAppType | ActionsLoginReducerType


export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
    return boundActions
}

// @ts-ignore
window.store = store