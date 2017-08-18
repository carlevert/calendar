import * as React from "react";
import * as ReactDOM from "react-dom";
import * as moment from "moment";

import App from "./src/Components/App"
import * as Actions from "./src/actions";

import { configureStore } from "./src/store"

const store = configureStore();

const params =  { username: "carlevert", password: "password"};

store.dispatch(Actions.startSignIn(params));

let root = document.createElement("div");
root.id = "root";
document.getElementsByTagName("body")[0].appendChild(root);

const startDate = moment(new Date(2017, 7, 1).valueOf() );

ReactDOM.render(<App startDate={startDate} numWeeks={20} />, root);
