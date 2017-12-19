// for actions
import actionCreatorFactory from "typescript-fsa"

// for reducers
import { reducerWithInitialState } from "typescript-fsa-reducers"

// for epics
import "rxjs"
import "typescript-fsa-redux-observable"
import { combineEpics } from "redux-observable"

// domain
import AccessToken from "../../../domain/AccessToken";
import AuthRepository from "../../../domain/AuthRepository"

//  Actions
//================================================================
const actionCreator = actionCreatorFactory("auth")
const fetchAccessToken = actionCreator.async<{ state: string, code: string }, AccessToken>("getAccessToken")
export const actions = {
  fetchAccessToken: fetchAccessToken.started,
}

//  State & Reducer
//================================================================
export interface State {
  accessToken: AccessToken | null
}

const INITIAL_STATE: State = {
  accessToken: null,
}

export function createAuthReducer(initialState: State = INITIAL_STATE) {
  return reducerWithInitialState(initialState)
    .caseWithAction(fetchAccessToken.done, (state, { payload: { result: accessToken } }) => ({
      ...state,
      accessToken,
    }))
    .build()
}

//  Epics
//================================================================
export function createAuthEpic(repo: AuthRepository) {
  return combineEpics(
    action$ =>
      action$.ofAction(fetchAccessToken.started)
        .flatMap(({ payload }) =>
          repo.fechAccessToken({ code: payload.code, state: payload.state })
            .then((accessToken) => fetchAccessToken.done({ params: payload, result: accessToken }))
        ),
  )
}
