import {applyMiddleware, combineReducers, createStore} from "redux";
import {actionsTypeTodolists, todolistsReducer} from "./todolists-reducer";
import {actionsTypeTasks, tasksReducer} from "./tasks-reducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {ActionAppType, appReducer} from "./app-reducer";
import {ActionsLoginReducerType, authReducer} from "./authReducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer

})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export type ActionsType = actionsTypeTodolists | actionsTypeTasks | ActionAppType | ActionsLoginReducerType


// @ts-ignore
window.store = store