import { Action } from 'redux';
import { Success } from 'typescript-fsa/lib';
import actionCreatorFactory from "typescript-fsa";

import * as CryptoJS from 'crypto-js';
import * as Saga from 'redux-saga';
import { bindAsyncAction } from "typescript-fsa-redux-saga"


const encrypt = (message: string, key: string) => CryptoJS.AES.encrypt(message, key).toString();
const decrypt = (encryptedMessage: string, key: string) => CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);

const key = "key";
// console.log("encrypted key: ", encrypt("secretKey", key))
// console.log("decrypted: ", decrypt("U2FsdGVkX1/O3aXpOa+P7nesu4rQ5rM1q/qYv427yGY=", key))
const actionCreator = actionCreatorFactory();

interface SignInParams {
   username: string;
   password: string;
}
interface SignInResult {
   success: boolean;
   key: string;
}
interface AjaxError {
   error: string;
}

export const startSignIn = actionCreator<SignInParams>("START_SIGN_IN");

export const signIn = actionCreator.async<SignInParams, SignInResult, AjaxError>("SIGN_IN");

const secretKey = "secret";

const signInFunc = async (params: SignInParams) =>
   new Promise<SignInResult>((resolve, reject) => {
      setTimeout(() => {
         if (params.username == "carlevert")
            reject({
               success: true,
               key: secretKey
            });
         else
            reject({
               success: false,
               key: undefined
            });
      }, 2000);
   });

export const signInWorker = bindAsyncAction(signIn)(
   function* (params): Saga.SagaIterator {
      const result = yield Saga.effects.call(signInFunc, params)
      return result;
   }
);

export function* watcher() {
   const action = yield Saga.effects.take(startSignIn);
   const result: SignInResult = yield Saga.effects.call(signInWorker, action.payload);
   console.log(result);
}

export function* rootSaga() {
   yield [watcher()]
}

// export function signInFlow(params: SignInParams) {
//    return dispatch => {
//       dispatch(signIn.started(params));
//       signInFunc(params)
//          .then(result => {
//             console.log(JSON.stringify(result));
//             if (result.success)
//                dispatch(signIn.done);
//             else
//                dispatch(signIn.failed)
//          });
//    }
// }
