import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux"

import { Router, Route, Switch } from "react-router"
import { createBrowserHistory } from "history";

import { configureStore } from "./src/store"

import { Main } from "./src/Components/Main"
import { Hello, Home, NoMatch } from "./src/Components/Comp"

import * as Actions from "./src/actions"
const history = createBrowserHistory();

const store = configureStore();

let root = document.createElement("div");
root.id = "root";
document.getElementsByTagName("body")[0].appendChild(root);

ReactDOM.render(<Provider store={store}>
   <Router history={history}>
      <Switch>
         <Route exact path="/" component={Main} />
         <Route path="/hello" component={Hello} />
         <Route path="/home" component={Home} />
         <Route path="/nomatch" component={Main} />
         </Switch>
   </Router>
</Provider>, root);

store.dispatch(Actions.testAction())