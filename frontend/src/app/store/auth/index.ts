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
import { FetchStatus } from "domain/FetchStatus";

//  Actions
//================================================================
const actionCreator = actionCreatorFactory("auth")
const getOauthState = actionCreator.async<{ create: boolean }, { state: string }>("getOauthState")
const fetchAccessToken = actionCreator.async<{ state: string | null, code: string | null }, AccessToken>("getAccessToken")

export const actions = {
  getOauthState: getOauthState.started,
  fetchAccessToken: fetchAccessToken.started,
}

//  State & Reducer
//================================================================
export interface AuthState {
  accessToken: AccessToken | null
  oauthState: string | null
  fetchStatus: {
    accessToken: FetchStatus,
    oauthState: FetchStatus,
  }
}

const INITIAL_STATE: AuthState = {
  accessToken: null,
  oauthState: null,
  fetchStatus: {
    accessToken: "none",
    oauthState: "none",
  },
}

export function createAuthReducer(initialState: AuthState = INITIAL_STATE) {
  return reducerWithInitialState(initialState)
    .caseWithAction(fetchAccessToken.started, (state) => ({
      ...state,
      fetchStatus: {
        ...state.fetchStatus,
        accessToken: "loading",
      },
    }))
    .caseWithAction(fetchAccessToken.done, (state, { payload: { result: accessToken } }) => ({
      ...state,
      accessToken,
      fetchStatus: {
        ...state.fetchStatus,
        accessToken: "loaded",
      },
    }))
    .caseWithAction(fetchAccessToken.failed, state => ({
      ...state,
      fetchStatus: {
        ...state.fetchStatus,
        accessToken: "failed",
      },
    }))
    .caseWithAction(getOauthState.started, (state) => ({
      ...state,
      fetchStatus: {
        ...state.fetchStatus,
        oauthState: "loading",
      },
    }))
    .caseWithAction(getOauthState.done, (state, { payload: { result: { state: oauthState }} }) => ({
      ...state,
      oauthState,
      fetchStatus: {
        ...state.fetchStatus,
        oauthState: "loaded",
      },
    }))
    .caseWithAction(getOauthState.failed, state => ({
      ...state,
      fetchStatus: {
        ...state.fetchStatus,
        oauthState: "failed",
      },
    }))
    .build()
}

//  Epics
//================================================================

export function createAuthEpic() {
  return combineEpics<Action, Store<AuthState>, { authRepository: AuthRepository }>(
    // an epic for fetchAccessToken.started
    (action$, _, { authRepository }) =>
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
    // an epic for getOauthState.started
    (action$, _, { authRepository }) =>
        action$.ofAction(getOauthState.started)
          .flatMap(({ payload }): Observable<Action> => {
            let o: Observable<string>
            if (payload.create) {
              const state = new Date().getTime().toString() // TODO: should use random string
              o = Observable.fromPromise(authRepository.setOauthState(state).then(() => state))
            } else {
              o = Observable.fromPromise(authRepository.getOauthState())
            }
            return o
              .map(state => getOauthState.done({ params: payload, result: { state } }))
              .catch(error => Observable.of(getOauthState.failed({ params: payload, error })))
          })
  )
}
