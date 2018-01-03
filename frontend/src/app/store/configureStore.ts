import { combineReducers, createStore, applyMiddleware, Reducer, Store } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"
import { routerReducer, routerMiddleware } from "react-router-redux"
import { History } from "history";

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"
import { createConfigReducer } from "./config"

// dependencies
import AuthRepository from "domain/AuthRepository"

// types
import Config from "common/config";
import { RootState } from ".";

interface Dependencies {
  authRepository: AuthRepository
}

function createRedcuer(config: Config): Reducer<RootState> {
  return combineReducers({
    auth: createAuthReducer(),
    config: createConfigReducer(config),
    router: routerReducer,
  })
}

function createEpic() {
  return combineEpics(
     createAuthEpic(),
  )
}

interface ConfigureParams {
  config: Config
  dependencies: Dependencies
  history: History
}

export default function configureStore({ config, history, dependencies }: ConfigureParams): Store<RootState> {
  const store = createStore(
    createRedcuer(config),
    applyMiddleware(
      routerMiddleware(history),
      createEpicMiddleware(createEpic(), { dependencies }),
    ),
  )

  return store
}
