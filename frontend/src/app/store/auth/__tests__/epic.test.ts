import { createEpicMiddleware, ActionsObservable } from "redux-observable"
import configureMockStore from "redux-mock-store"

// dependencies
import AuthRepository from "domain/AuthRepository";

// target
import { actions, createAuthEpic } from "../"
import { Action, Success, Failure } from "typescript-fsa";

const createTestContext = (authRepository: AuthRepository) => {
  const dependencies = { authRepository }
  const epic = createAuthEpic()
  const mockStore = configureMockStore<any>([createEpicMiddleware(epic, { dependencies })])
  const store = mockStore()
  const dispatch =
    (a: Action<any>) => epic(ActionsObservable.of(a), store, dependencies).toArray().toPromise()
  return { epic, dependencies, store, dispatch }
}

describe("fetchAccessToken.started", () => {
  describe("when an oauth state are stored", () => {
    it("maps a doen action with retrieved an access token", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          fetchAccessToken: jest.fn().mockReturnValueOnce(Promise.resolve({ token: "foo" })),
          getOauthState: jest.fn().mockReturnValue(Promise.resolve("bar")),
      }))
      const repo = new MockAuthRepository()
      const { dispatch } = createTestContext(repo)

      const action = actions.fetchAccessToken({ code: "baz" })
      const gotActions = await dispatch(action)

      expect(repo.fetchAccessToken).toBeCalledWith({ state: "bar", code: "baz" })
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ token: "foo" })
    })
  })

  describe("when oauth states are not stored", () => {
    it("maps an error action", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          fetchAccessToken: jest.fn().mockReturnValueOnce(Promise.resolve({ token: "foo" })),
          getOauthState: jest.fn().mockReturnValue(Promise.reject("Error occurred!")),
      }))
      const repo = new MockAuthRepository()
      const { dispatch } = createTestContext(repo)

      const action = actions.fetchAccessToken({ code: "baz" })
      const gotActions = await dispatch(action)

      expect(repo.fetchAccessToken).not.toBeCalled()
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Failure<any, any>>).payload.error).toBe("Error occurred!")
    })
  })

  describe("when oauth states are not stored", () => {
    it("maps an error action", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          fetchAccessToken: jest.fn().mockReturnValueOnce(Promise.reject("Error occurred!")),
          getOauthState: jest.fn().mockReturnValue(Promise.resolve("bar"))
      }))
      const repo = new MockAuthRepository()
      const { dispatch } = createTestContext(repo)

      const action = actions.fetchAccessToken({ code: "baz" })
      const gotActions = await dispatch(action)

      expect(repo.fetchAccessToken).toBeCalledWith({ state: "bar", code: "baz" })
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Failure<any, any>>).payload.error).toBe("Error occurred!")
    })
  })
})

describe("getAccessToken.started", () => {
  describe("when any access tokens have not been stored", async () =>{
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          getAccessToken: jest.fn().mockReturnValue(Promise.reject("accessToken has not been stored"))
      }))
      const repo = new MockAuthRepository()
      const { dispatch } = createTestContext(repo)

      const action = actions.getAccessToken({})
      const gotActions = await dispatch(action)

      expect(repo.getAccessToken).toBeCalled()
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Failure<any, any>>).payload.error).toBe("accessToken has not been stored")
  })

  describe("when an access token has been stored", async () =>{
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          getAccessToken: jest.fn().mockReturnValue(Promise.resolve({ token: "testtoken" }))
      }))
      const repo = new MockAuthRepository()
      const { dispatch } = createTestContext(repo)

      const action = actions.getAccessToken({})
      const gotActions = await dispatch(action)

      expect(repo.getAccessToken).toBeCalled()
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ token: "testtoken" })
  })
})

describe("createOauthState.started", () => {
  it("maps a done action with created an oauth token", async () => {
    const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        setOauthState: jest.fn().mockReturnValue(Promise.resolve(null)),
    }))
    const repo = new MockAuthRepository()
    const { dispatch } = createTestContext(repo)

    const gotActions = await dispatch(actions.createOauthState({}))

    expect(repo.setOauthState).toBeCalledWith(expect.any(String))
    expect(gotActions).toHaveLength(1)
    expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ state: expect.any(String) })
  })
})
