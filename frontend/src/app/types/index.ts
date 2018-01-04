// dependencies
import AuthRepository from "domain/AuthRepository"

export interface Config {
  apiEndpoint: string
  githubClientId: string
}

export interface Dependencies {
  authRepository: AuthRepository
}
