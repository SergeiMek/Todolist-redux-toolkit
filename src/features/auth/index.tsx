import { Login } from './Login'
import * as authSelectors from './selectors'
import * as authAsyncActions from './auth-action'
import {slice} from './authReducer';


const authActions = {
    ...slice.actions,
    ...authAsyncActions
}


export {
    authSelectors,
    Login,
    authActions
}