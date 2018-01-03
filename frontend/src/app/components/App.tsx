import * as React from "react"
import { Provider, Store } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { History } from "history"

import { RootState } from "app/store"

import Routes from "./routes"

interface Props {
  store: Store<RootState>
  history: History,
}

export default function App({ store, history }: Props) {
  return (
    <Provider {...{ store }}>
      <ConnectedRouter {...{ history }}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  )
}
