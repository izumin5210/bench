import { createSelector } from "reselect"
import { RootState } from "../"

export const getConfig = ({ config }: RootState) => config

export const getGithubClientId = createSelector(
  getConfig,
  ({ githubClientId }) => githubClientId,
)
