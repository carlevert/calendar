import * as Redux from "redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import rootReducer, { State as RootState } from "./reducer";
import * as Actions from "./actions"

const sagaMiddleware = createSagaMiddleware();

export function configureStore(initialState?: RootState): Redux.Store<RootState> {
   const create = (<any>window).devToolsExtension ? (<any>window).devToolsExtension()(Redux.createStore) : Redux.createStore;

   const store = Redux.createStore(rootReducer, initialState,
      Redux.applyMiddleware(sagaMiddleware));

   sagaMiddleware.run(Actions.rootSaga);

   return store;

}



// import * as CryptoJS from "crypto-js";
// const encrypt = (message: string, key: string) => CryptoJS.AES.encrypt(message, key).toString();
// const decrypt = (encryptedMessage: string, key: string) => CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
// console.log(decrypt(encrypt("test", "mykey"), "mykey"))
