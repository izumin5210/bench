import { createSelector } from "reselect"
import { RootState } from "../"

export const getAuthState = ({ auth }: RootState) => auth

export const getOauthState = createSelector(
  getAuthState,
  ({ oauthState }) => oauthState,
)
