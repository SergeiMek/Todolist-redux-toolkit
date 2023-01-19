import {setAppErrorAC, setAppStatusAC} from "../state/app-reducer";
import {Dispatch} from "redux";
import {ActionsType} from "../state/store";
import {ResponseType} from "../api/todolists-api";

export const handleServerAppError =<D>(data:ResponseType<D>,dispatch: Dispatch<ActionsType>)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))

}

export const handlerServerError =(error:any,dispatch: Dispatch<ActionsType>)=>{
    dispatch(setAppErrorAC(error.message? error.message : 'some error occurred'))
    dispatch(setAppStatusAC('failed'))
}
