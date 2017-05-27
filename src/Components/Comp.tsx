
import * as React from 'react'
import { Link } from "react-router-dom"

export const Hello = () => (
  <div>
    <div>Hello</div>
  </div>
)

export const Home = () => (
  <div>
    <Link to="/">Back</Link>
    Home
  </div>
)

export const NoMatch = () => (
  <div>
    No Match
  </div>
)
