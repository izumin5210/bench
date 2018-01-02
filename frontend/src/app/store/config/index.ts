import { Config } from "common/config";
import { reducerWithInitialState } from "typescript-fsa-reducers/dist";

export function createConfigReducer(initialState: Config) {
  return reducerWithInitialState(initialState)
    .build()
}
