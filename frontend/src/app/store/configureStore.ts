import { combineReducers, createStore, applyMiddleware } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"

// dependencies
import AuthRepository from "domain/AuthRepository"

interface Dependencies {
  authRepository: AuthRepository
}

function createRedcuer() {
  return combineReducers({
    auth: createAuthReducer(),
  })
}

function createEpic(deps: Dependencies) {
  return combineEpics(
     createAuthEpic(deps),
  )
}

export default function configureStore(deps: Dependencies) {
  const store = createStore(
    createRedcuer(),
    applyMiddleware(
      createEpicMiddleware(createEpic(deps)),
    ),
  )

  return store
}
