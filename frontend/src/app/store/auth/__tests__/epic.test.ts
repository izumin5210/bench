import { createEpicMiddleware, ActionsObservable } from "redux-observable"
import configureMockStore from "redux-mock-store"

// dependencies
import AuthRepository from "domain/AuthRepository";

// target
import { actions, createAuthEpic } from "../"
import { Action, Success } from "typescript-fsa";

const createStoreAndEpic = (dependencies: { authRepository: AuthRepository }) => {
  const epic = createAuthEpic()
  const mockStore = configureMockStore<any>([createEpicMiddleware(epic, { dependencies })])
  const store = mockStore()
  return { store, epic }
}

describe("authEpic", () => {
  it("handle fetchAccessToken.stared", async () => {
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

  it("handle createOauthState.started", async () => {
    const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        setOauthState: jest.fn().mockReturnValue(Promise.resolve(null)),
    }))
    const repo = new MockAuthRepository()
    const dependencies = { authRepository: repo }
    const { store, epic } = createStoreAndEpic(dependencies)

    const action = actions.createOauthState({})
    const gotActions = await epic(ActionsObservable.of(action), store, dependencies).toArray().toPromise()

    expect(repo.setOauthState).toBeCalledWith(expect.any(String))
    expect(gotActions).toHaveLength(1)
    expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ state: expect.any(String) })
  })
})
