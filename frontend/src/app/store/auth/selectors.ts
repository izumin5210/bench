import { createSelector } from "reselect"
import { RootState } from "../"

export const getAuthState = ({ auth }: RootState) => auth

export const getOauthState = createSelector(
  getAuthState,
  ({ oauthState }) => oauthState,
)

export const getFetchStatus = createSelector(
  getAuthState,
  ({ fetchStatus }) => fetchStatus,
)

export const getAccessTokenFetchStatus = createSelector(
  getFetchStatus,
  ({ accessToken }) => accessToken,
)

export const isAccessTokenFetched = createSelector(
  getAccessTokenFetchStatus,
  status => status == "loaded" || status == "failed",
)
