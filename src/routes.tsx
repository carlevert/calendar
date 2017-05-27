import * as React from 'react'
import * as ReactDOM from "react-dom"

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Home, Hello, NoMatch } from './Components/Comp'

const routes = (
  <div>
      <Route exact path="/" component={Home} />
      <Route path="/hello" component={Hello} />
      <Route component={NoMatch} />
  </div>
)

export default routes;