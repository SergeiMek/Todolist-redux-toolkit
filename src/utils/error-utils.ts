import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ActionsType} from "../state/store";
import {ResponseType} from "../api/todolists-api";

export const handleServerAppError =<D>(data:ResponseType<D>,dispatch: Dispatch<ActionsType>)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC({error:data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error:'some error occurred'}))
    }
    dispatch(setAppStatusAC({status:'failed'}))

}

export const handlerServerError =(error:any,dispatch: Dispatch<ActionsType>)=>{
    dispatch(setAppErrorAC(error.message? error.message : 'some error occurred'))
    dispatch(setAppStatusAC({status:'failed'}))
}
