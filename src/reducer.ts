import * as Redux from "redux";
import { Action, isType } from "typescript-fsa";

import * as Actions from "./actions"

export interface State {
   signedIn: boolean;
   signInStarted: boolean;
}

export const initialState: State = {
   signedIn: false,
   signInStarted: false
}

export default (state: State = initialState, action: Redux.Action) => {
   console.log(action)
   if (isType(action, Actions.signIn.started)) {
      return {
         ...state,
         signInStarted: true
      }
   }

   if (isType(action, Actions.signIn.done)) {
      if (action.payload.result.success)
         return {
            ...state,
            signInStarted: false,
            signedIn: true
         }
      else
         return {
            ...state,
            signInStarted: false,
            signedIn: false
         }
   }

   if (isType(action, Actions.signIn.failed)) {
      throw Error("Sign in failed");
   }

   return state;

}

// const store = Redux.createStore<State>(reducer, Redux.applyMiddleware(thunk));

// import * as CryptoJS from "crypto-js";
// const encrypt = (message: string, key: string) => CryptoJS.AES.encrypt(message, key).toString();
// const decrypt = (encryptedMessage: string, key: string) => CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
// console.log(decrypt(encrypt("test", "mykey"), "mykey"))
