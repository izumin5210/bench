import * as React from "react"
import { render } from "react-dom"

import App from "./components"
import { configureStore, ConfigureParams } from "./store"

interface RunParams {
  container: HTMLElement | null,
}

type Params = RunParams & ConfigureParams

export default function run(params: Params) {
  const { history, container } = params
  const store = configureStore(params)

  render(
    (<App {...{ store, history }} />),
    container,
  )
}
