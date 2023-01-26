import {AppRootState} from "../../state/store";


export const selectIsLoggedIn = (state:AppRootState)=>state.auth.isLoggedIn