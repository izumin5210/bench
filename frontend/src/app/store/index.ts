import { AuthState } from "./auth"
import { Config } from "common/config";

export interface RootState {
  auth: AuthState
  config: Config,
}
