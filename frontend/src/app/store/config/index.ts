import { reducerWithInitialState } from "typescript-fsa-reducers"

import Config from "common/config"

export function createConfigReducer(initialState: Config) {
  return reducerWithInitialState(initialState)
    .build()
}
