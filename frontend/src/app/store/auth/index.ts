// for actions
import actionCreatorFactory, { Action } from "typescript-fsa"

// for reducers
import { reducerWithInitialState } from "typescript-fsa-reducers"

// for epics
import { Observable } from "rxjs"
import "typescript-fsa-redux-observable"
import { combineEpics } from "redux-observable"

// domain
import AccessToken from "../../../domain/AccessToken";
import AuthRepository from "../../../domain/AuthRepository"

//  Actions
//================================================================
const actionCreator = actionCreatorFactory("auth")
const fetchAccessToken = actionCreator.async<{ state: string | null, code: string | null }, AccessToken>("getAccessToken")
export const actions = {
  fetchAccessToken: fetchAccessToken.started,
}

//  State & Reducer
//================================================================
export interface AuthState {
  accessToken: AccessToken | null
}

const INITIAL_STATE: AuthState = {
  accessToken: null,
}

export function createAuthReducer(initialState: AuthState = INITIAL_STATE) {
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
        .flatMap(({ payload }): Observable<Action<any>> => {
          const { code, state } = payload
          if (code == null || state == null) {
            return Observable.of(fetchAccessToken.failed({ params: payload, error: new Error() }))
          }
          return Observable.fromPromise(
            repo.fechAccessToken({ code, state })
              .then((accessToken) => fetchAccessToken.done({ params: payload, result: accessToken })),
          )
        }),
  )
}
