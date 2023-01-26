import {appReducer, initializeAppTC, setAppErrorAC, setAppStatusAC, StatusType} from "./app-reducer";


type InitialStateType = {
    status: StatusType,
    error: string | null,
    isInitialized: boolean
}

let startState: InitialStateType

beforeEach(()=>{
    startState={
        error:null,
        status:'idle',
        isInitialized:false
    }
})

test('correct error message should be set',()=>{
    const endState = appReducer(startState,setAppErrorAC({error:'some error'}))

    expect(endState.error).toBe('some error')
})

test('correct status message should be set',()=>{
    const endState = appReducer(startState,setAppStatusAC({status:'loading'}))

    expect(endState.status).toBe('loading')
})

test('correct initialized message should be set',()=>{
    const endState = appReducer(startState,initializeAppTC.fulfilled)

    expect(endState.isInitialized).toBe(true)
})