import * as React from "react"
import { MemoryRouter, Switch, Route } from "react-router-dom"
import { mount } from "enzyme"

import FetchStatus from "domain/FetchStatus";

import { CallbackContainer } from "../CallbackContainer"

interface TestProps {
  path: string
  fetchStatus: FetchStatus
  fetchAccessToken: (params: { state: string, code: string }) => any
}

const WorksComponent = () => (<h1>It works !</h1>)
const LoginComponent = () => (<h1>Login</h1>)
const TestApp = ({ path, ...rest }: TestProps) => (
  <MemoryRouter initialEntries={[path]}>
    <Switch>
      <Route
        path="/callback"
        render={routeProps => (<CallbackContainer {...routeProps} {...rest}/>)}
      />
      <Route
        path="/login"
        component={LoginComponent}
      />
      <Route
        component={WorksComponent}
      />
    </Switch>
  </MemoryRouter>
)

describe("CallbackContainer", () => {
  describe("when access tokens has not been fetched", () => {
    it("renders nothing and calls fetchAccessToken with params", () => {
      const fetchAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          path="/callback?code=foo&state=bar"
          fetchStatus="none"
          fetchAccessToken={fetchAccessTokenFn}
        />
      ))

      expect(fetchAccessTokenFn).toBeCalledWith({ code: "foo", state: "bar" })
      expect(wrapper.find(WorksComponent)).toHaveLength(0)
      expect(wrapper.find(LoginComponent)).toHaveLength(0)
    })
  })

  describe("when access tokens has been fetched", () => {
    it("redirects to root", () => {
      const fetchAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          path="/callback?code=foo&state=bar"
          fetchStatus="loaded"
          fetchAccessToken={fetchAccessTokenFn}
        />
      ))

      expect(fetchAccessTokenFn).not.toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(1)
      expect(wrapper.find(LoginComponent)).toHaveLength(0)
    })
  })

  describe("when access tokens has failed to be fetched", () => {
    it("redirects to login page", () => {
      const fetchAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          path="/callback?code=foo&state=bar"
          fetchStatus="failed"
          fetchAccessToken={fetchAccessTokenFn}
        />
      ))

      expect(fetchAccessTokenFn).not.toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(0)
      expect(wrapper.find(LoginComponent)).toHaveLength(1)
    })
  })
})
