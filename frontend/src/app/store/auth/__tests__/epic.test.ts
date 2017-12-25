import { createEpicMiddleware, ActionsObservable } from "redux-observable"
import configureMockStore from "redux-mock-store"

// dependencies
import AuthRepository from "domain/AuthRepository";

// target
import { actions, createAuthEpic } from "../"
import { Action, Success } from "typescript-fsa";

describe("authEpic", () => {
  it("handle fetchAccessToken.stared", async () => {
    const MockAuthRepository = jest.fn<AuthRepository>(() => ({
        fetchAccessToken: jest.fn().mockReturnValueOnce(Promise.resolve({ token: "foobarbaz" })),
    }))
    const repo = new MockAuthRepository()
    const epic = createAuthEpic({ authRepository: repo })
    const mockStore = configureMockStore<any>([createEpicMiddleware(epic)])
    const store = mockStore()
    const action = actions.fetchAccessToken({ state: "foo", code: "bar" })

    const gotActions = await epic(ActionsObservable.of(action), store, {}).toArray().toPromise()

    expect(repo.fetchAccessToken).toBeCalledWith({ state: "foo", code: "bar" })
    expect(gotActions).toHaveLength(1)
    expect((gotActions[0] as Action<Success<any, any>>).payload.result).toEqual({ token: "foobarbaz" })
  })
})
