import { RouterState } from "react-router-redux"

import { Config } from "app/types"
import { AuthState } from "./auth"

export interface RootState {
  auth: AuthState
  config: Config
  router: RouterState
}
