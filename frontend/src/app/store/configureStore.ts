import { combineReducers, createStore, applyMiddleware } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"

// reducers and epics
import { createAuthReducer, createAuthEpic } from "./auth"

// dependencies
import AuthRepository from "../../domain/AuthRepository"

function createRedcuer() {
  return combineReducers({
    auth: createAuthReducer(),
  })
}

function createEpic(authRepo: AuthRepository) {
  return combineEpics(
     createAuthEpic(authRepo),
  )
}

export default function configureStore(authRepo: AuthRepository) {
  const store = createStore(
    createRedcuer(),
    applyMiddleware(
      createEpicMiddleware(createEpic(authRepo)),
    ),
  )

  return store
}
