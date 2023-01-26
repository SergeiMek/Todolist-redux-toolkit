import React from "react";
import {AppRootState} from "../state/store";

export const selectStatus = (state:AppRootState)=>state.app.status
export const selectIsInitialized = (state:AppRootState)=>state.app.isInitialized