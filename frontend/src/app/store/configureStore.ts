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

function createEpic() {
  return combineEpics(
     createAuthEpic(),
  )
}

export default function configureStore(dependencies: Dependencies) {
  const store = createStore(
    createRedcuer(),
    applyMiddleware(
      createEpicMiddleware(createEpic(), { dependencies }),
    ),
  )

  return store
}
