import * as React from "react"
import { Switch } from "react-router-dom"

import Route from "./Route"
import LoginPageContainer from "./login/LoginPageContainer"
import CallbackContainer from "./auth/CallbackContainer"
import DashboardContainer from "./dashboard/DashboardContainer"

export default function Routes() {
  return (
    <Switch>
      <Route
        path="/login"
        component={LoginPageContainer}
        exact
      />
      <Route
        path="/auth/callback"
        component={CallbackContainer}
        exact
      />
      <Route
        path="/"
        component={DashboardContainer}
        exact
        private
      />
    </Switch>
  )
}
