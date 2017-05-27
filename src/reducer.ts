import * as Redux from "redux";
import { Action, isType } from "typescript-fsa";

import * as Actions from "./actions"

export interface AppState {
    title: string;
}
export const initialAppState: AppState = {
    title: ""
}
export const appReducer = (state: AppState = initialAppState, action: Redux.Action) => {
    if (isType(action, Actions.testAction)) {
        console.log("testAction")
        return { title: "test" }
    }
    return state;
}


// -------------

export interface RootState {
    app: AppState;
}

export default Redux.combineReducers<RootState>({
    app: appReducer
})


// const store = Redux.createStore<State>(reducer, Redux.applyMiddleware(thunk));


// import * as CryptoJS from "crypto-js";
// const encrypt = (message: string, key: string) => CryptoJS.AES.encrypt(message, key).toString();
// const decrypt = (encryptedMessage: string, key: string) => CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
// console.log(decrypt(encrypt("test", "mykey"), "mykey"))
