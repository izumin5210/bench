import { reducerWithInitialState } from "typescript-fsa-reducers"

import { Config } from "app/types"

export function createConfigReducer(initialState: Config) {
  return reducerWithInitialState(initialState)
    .build()
}
