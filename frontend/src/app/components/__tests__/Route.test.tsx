import * as React from "react"
import { MemoryRouter, Switch, Route as ReactRouterRoute } from "react-router-dom"
import { mount } from "enzyme"

import { Route } from "../Route"
import FetchStatus from "domain/FetchStatus";

const WorksComponent = () => (<h1>It works !</h1>)
const LoginComponent = () => (<h1>Login</h1>)
const TestApp = (props: { private: boolean, fetchStatus: FetchStatus, getAccessToken: () => any }) => (
  <MemoryRouter initialEntries={["/app"]}>
    <Switch>
      <Route
        path="/app"
        component={WorksComponent}
        exact
        {...props}
      />
      <ReactRouterRoute
        component={LoginComponent}
      />
    </Switch>
  </MemoryRouter>
)

describe("Route with private", () => {
  describe("when any access tokens has not been fetched", () => {
    it("renders nothing and calls getAccessToken", () => {
      const getAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          fetchStatus="none"
          getAccessToken={getAccessTokenFn}
          private
        />
      ))

      expect(getAccessTokenFn).toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(0)
      expect(wrapper.find(LoginComponent)).toHaveLength(0)
    })
  })

  describe("when any access tokens being fetched", () => {
    it("renders nothing and does not call getAccessToken", () => {
      const getAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          fetchStatus="loading"
          getAccessToken={getAccessTokenFn}
          private
        />
      ))

      expect(getAccessTokenFn).not.toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(0)
      expect(wrapper.find(LoginComponent)).toHaveLength(0)
    })
  })

  describe("when any access tokens has been fetched", () => {
    it("renders component and does not call getAccessToken", () => {
      const getAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          fetchStatus="loaded"
          getAccessToken={getAccessTokenFn}
          private
        />
      ))

      expect(getAccessTokenFn).not.toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(1)
      expect(wrapper.find(LoginComponent)).toHaveLength(0)
    })
  })

  describe("when access tokens has failed to be fetched", () => {
    it("redirects to login page", () => {
      const getAccessTokenFn = jest.fn()
      const wrapper = mount((
        <TestApp
          fetchStatus="failed"
          getAccessToken={getAccessTokenFn}
          private
        />
      ))

      expect(getAccessTokenFn).not.toBeCalled()
      expect(wrapper.find(WorksComponent)).toHaveLength(0)
      expect(wrapper.find(LoginComponent)).toHaveLength(1)
    })
  })
})

describe("Route with public", () => {
  it("renders works and does not call getAccessToken", () => {
    const getAccessTokenFn = jest.fn()
    const wrapper = mount((
      <TestApp
        fetchStatus="none"
        getAccessToken={getAccessTokenFn}
        private={false}
      />
    ))

    expect(getAccessTokenFn).not.toBeCalled()
    expect(wrapper.find(WorksComponent)).toHaveLength(1)
    expect(wrapper.find(LoginComponent)).toHaveLength(0)
  })
})
