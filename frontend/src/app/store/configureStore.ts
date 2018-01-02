import { combineReducers, createStore, applyMiddleware } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"
import { createConfigReducer } from "./config"

// dependencies
import AuthRepository from "domain/AuthRepository"

// types
import { Config } from "common/config";

interface Dependencies {
  authRepository: AuthRepository
}

function createRedcuer(config: Config) {
  return combineReducers({
    auth: createAuthReducer(),
    config: createConfigReducer(config),
  })
}

function createEpic() {
  return combineEpics(
     createAuthEpic(),
  )
}

export default function configureStore(config: Config, dependencies: Dependencies) {
  const store = createStore(
    createRedcuer(config),
    applyMiddleware(
      createEpicMiddleware(createEpic(), { dependencies }),
    ),
  )

  return store
}
