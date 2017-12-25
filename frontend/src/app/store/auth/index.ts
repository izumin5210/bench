// for actions
import actionCreatorFactory from "typescript-fsa"

// for reducers
import { reducerWithInitialState } from "typescript-fsa-reducers"

// for epics
import { Action, Store } from "redux";
import { Observable } from "rxjs"
import { combineEpics } from "redux-observable"
import "common/typescript-fsa-redux-observable"

// domain
import AccessToken from "domain/AccessToken";
import AuthRepository from "domain/AuthRepository"

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
  fetchStatus: "none" | "loading" | "loaded" | "failed"
}

const INITIAL_STATE: AuthState = {
  accessToken: null,
  fetchStatus: "none",
}

export function createAuthReducer(initialState: AuthState = INITIAL_STATE) {
  return reducerWithInitialState(initialState)
    .caseWithAction(fetchAccessToken.started, (state) => ({
      ...state,
      fetchStatus: "loading",
    }))
    .caseWithAction(fetchAccessToken.done, (state, { payload: { result: accessToken } }) => ({
      ...state,
      accessToken,
      fetchStatus: "loaded",
    }))
    .build()
}

//  Epics
//================================================================
export function createAuthEpic({ authRepository }: { authRepository: AuthRepository }) {
  return combineEpics(
    action$ =>
      action$.ofAction(fetchAccessToken.started)
        .flatMap(({ payload }): Observable<Action> => {
          const { code, state } = payload
          if (code == null || state == null) {
            return Observable.of(fetchAccessToken.failed({ params: payload, error: new Error() }))
          }
          return Observable.fromPromise(
            authRepository.fetchAccessToken({ code, state })
              .then((accessToken) => fetchAccessToken.done({ params: payload, result: accessToken })),
          )
        }),
  )
}
