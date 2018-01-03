import { History } from "history"
import { RootState } from "app/store"

// dependencies
import AuthRepository from "domain/AuthRepository"

export interface Config {
  apiEndpoint: string
  githubClientId: string
}

export interface Dependencies {
  authRepository: AuthRepository
}

export interface Params {
  config: Config
  dependencies: Dependencies
  history: History
  initialState: RootState
}
