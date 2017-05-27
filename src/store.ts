import * as Redux from "redux";

import rootReducer, { RootState } from "./reducer";

export function configureStore(initialState?: RootState): Redux.Store<RootState> {
   const create = (<any>window).devToolsExtension ? (<any>window).devToolsExtension()(Redux.createStore) : Redux.createStore;

   const store = Redux.createStore(rootReducer, initialState);
   return store;

}


// const store = Redux.createStore<State>(reducer, Redux.applyMiddleware(thunk));


// import * as CryptoJS from "crypto-js";
// const encrypt = (message: string, key: string) => CryptoJS.AES.encrypt(message, key).toString();
// const decrypt = (encryptedMessage: string, key: string) => CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
// console.log(decrypt(encrypt("test", "mykey"), "mykey"))
