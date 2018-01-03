import { combineReducers, createStore, applyMiddleware, Reducer, Store } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"
import { routerReducer, routerMiddleware } from "react-router-redux"

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"
import { createConfigReducer } from "./config"

// types
import { Config, Params } from "app/types"
import { RootState } from "."

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

export default function configureStore({ config, history, dependencies }: Params): Store<RootState> {
  const store = createStore(
    createRedcuer(config),
    applyMiddleware(
      routerMiddleware(history),
      createEpicMiddleware(createEpic(), { dependencies }),
    ),
  )

  return store
}
