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
import FetchStatus from "domain/FetchStatus";

//  Actions
//================================================================
const actionCreator = actionCreatorFactory("auth")
const createOauthState = actionCreator.async<{}, { state: string }>("craeteOauthState")
const fetchAccessToken = actionCreator.async<{ code: string | null }, AccessToken>("fetchAccessToken")
const getAccessToken = actionCreator.async<{}, AccessToken>("getAccessToken")

export const actions = {
  createOauthState: createOauthState.started,
  fetchAccessToken: fetchAccessToken.started,
  getAccessToken: getAccessToken.started,
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
    // fetchAccessToken
    .caseWithAction(fetchAccessToken.started, (state) => ({
      ...state,
      fetchStatus: { ...state.fetchStatus, accessToken: "loading" },
    }))
    .caseWithAction(fetchAccessToken.done, (state, { payload: { result: accessToken } }) => ({
      ...state,
      accessToken,
      fetchStatus: { ...state.fetchStatus, accessToken: "loaded" },
    }))
    // getAccessToken
    .caseWithAction(getAccessToken.started, (state) => ({
      ...state,
      fetchStatus: { ...state.fetchStatus, accessToken: "loading" },
    }))
    .caseWithAction(getAccessToken.done, (state, { payload: { result: accessToken } }) => ({
      ...state,
      accessToken,
      fetchStatus: { ...state.fetchStatus, accessToken: "loaded" },
    }))
    .caseWithAction(getAccessToken.failed, (state) => ({
      ...state,
      fetchStatus: { ...state.fetchStatus, accessToken: "failed" },
    }))
    // createOauthState
    .caseWithAction(createOauthState.started, (state) => ({
      ...state,
      fetchStatus: { ...state.fetchStatus, oauthState: "loading" },
    }))
    .caseWithAction(createOauthState.done, (state, { payload: { result: { state: oauthState }} }) => ({
      ...state,
      oauthState,
      fetchStatus: { ...state.fetchStatus, oauthState: "loaded" },
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
          const { code } = payload
          if (code == null) {
            return Observable.of(fetchAccessToken.failed({ params: payload, error: new Error() }))
          }
          return Observable.fromPromise(authRepository.getOauthState())
            .flatMap((state) => Observable.fromPromise(authRepository.fetchAccessToken({ code, state })))
            .map((accessToken) => fetchAccessToken.done({ params: payload, result: accessToken }))
            .catch(error => Observable.of(fetchAccessToken.failed({ params: payload, error })))
        }),
    // an epic for createOauthState.started
    (action$, _, { authRepository }) =>
        action$.ofAction(createOauthState.started)
          .flatMap(({ payload }): Observable<Action> => {
            const state = new Date().getTime().toString() // TODO: should use random string
            return Observable.fromPromise(authRepository.setOauthState(state))
              .map(() => createOauthState.done({ params: payload, result: { state }}))
          })
  )
}
