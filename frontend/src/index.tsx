import { createBrowserHistory } from "history"

import { run } from "app"
import loadConfig from "./loadConfig"

// dependencies
import AuthRepository from "infra/AuthRepository"

const config = loadConfig()
const history = createBrowserHistory()
const initialState = null

const dependencies = {
  authRepository: new AuthRepository(),
}

const container = document.getElementById("app")

run({
  config,
  dependencies,
  history,
  initialState,
  container,
})
