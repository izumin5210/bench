import { combineReducers, createStore, applyMiddleware, Reducer, Store } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"
import { routerReducer, routerMiddleware } from "react-router-redux"

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"
import { createConfigReducer } from "./config"

// types
import { History } from "history"
import { Config, Dependencies } from "app/types"
import RootState from "./RootState"

export interface Params {
  config: Config
  dependencies: Dependencies
  history: History
  initialState: RootState | null
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

export default function configureStore({ config, history, dependencies, initialState }: Params): Store<RootState> {
  const reducer = createRedcuer(config)
  const middleware = applyMiddleware(
    routerMiddleware(history),
    createEpicMiddleware(createEpic(), { dependencies }),
  )

  if (initialState == null) {
    return createStore(reducer, middleware)
  }

  return createStore(reducer, initialState, middleware)
}
