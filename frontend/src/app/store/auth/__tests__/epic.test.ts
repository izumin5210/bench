import { createEpicMiddleware, ActionsObservable } from "redux-observable"
import configureMockStore from "redux-mock-store"

// dependencies
import AuthRepository from "domain/AuthRepository";

// target
import { actions, createAuthEpic } from "../"
import { Action, Success, Failure } from "typescript-fsa";

const createStoreAndEpic = (dependencies: { authRepository: AuthRepository }) => {
  const epic = createAuthEpic()
  const mockStore = configureMockStore<any>([createEpicMiddleware(epic, { dependencies })])
  const store = mockStore()
  return { store, epic }
}

describe("fetchAccessToken", () => {
  it("handle stared", async () => {
    const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        fetchAccessToken: jest.fn().mockReturnValueOnce(Promise.resolve({ token: "foobarbaz" })),
    }))
    const repo = new MockAuthRepository()
    const dependencies = { authRepository: repo }
    const { store, epic } = createStoreAndEpic(dependencies)

    const action = actions.fetchAccessToken({ state: "foo", code: "bar" })
    const gotActions = await epic(ActionsObservable.of(action), store, dependencies).toArray().toPromise()

    expect(repo.fetchAccessToken).toBeCalledWith({ state: "foo", code: "bar" })
    expect(gotActions).toHaveLength(1)
    expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ token: "foobarbaz" })
  })
})

describe("getOauthState", () => {
  describe("when create option is enabled", () => {
    it("creates a new oauth state and returns it", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
          setOauthState: jest.fn().mockReturnValue(Promise.resolve(null)),
      }))
      const repo = new MockAuthRepository()
      const dependencies = { authRepository: repo }
      const { store, epic } = createStoreAndEpic(dependencies)

      const action = actions.getOauthState({ create: true })
      const gotActions = await epic(ActionsObservable.of(action), store, dependencies).toArray().toPromise()

      expect(repo.setOauthState).toBeCalledWith(expect.any(String))
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ state: expect.any(String) })
    })
  })

  describe("when create option is disabled", () => {
    it("retrieves stored oauth state and returns it", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        getOauthState: jest.fn().mockReturnValue(Promise.resolve("foobar")),
      }))
      const repo = new MockAuthRepository()
      const dependencies = { authRepository: repo }
      const { store, epic } = createStoreAndEpic(dependencies)

      const action = actions.getOauthState({ create: false })
      const gotActions = await epic(ActionsObservable.of(action), store, dependencies).toArray().toPromise()

      expect(repo.getOauthState).toBeCalled()
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ state: expect.any(String) })
    })

    it("maps to an error action when any states are not stored", async () => {
      const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        getOauthState: jest.fn().mockReturnValue(Promise.reject("Error occurred!")),
      }))
      const repo = new MockAuthRepository()
      const dependencies = { authRepository: repo }
      const { store, epic } = createStoreAndEpic(dependencies)

      const action = actions.getOauthState({ create: false })
      const gotActions = await epic(ActionsObservable.of(action), store, dependencies).toArray().toPromise()

      expect(repo.getOauthState).toBeCalled()
      expect(gotActions).toHaveLength(1)
      expect((gotActions[0] as Action<Failure<any, any>>).payload.error).toBe("Error occurred!")
    })
  })
})
