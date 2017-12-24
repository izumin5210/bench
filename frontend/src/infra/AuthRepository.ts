import AuthRepository from "domain/AuthRepository"
import config from "common/config"

import { getAccessToken, setAccessToken } from "./localStorage"

export default class AuthRepositoryImpl implements AuthRepository {
  fetchAccessToken({ code, state }: { code: string, state: string }) {
    return fetch(`${config.apiEndpoint}/auth`, { method: 'POST', body: { code, state } })
      .then(res => res.json())
      .then(({ accessToken }) => {
        setAccessToken(accessToken)
        return { token: accessToken }
      })
  }

  getAccessToken() {
    const accessToken = getAccessToken()
    if (accessToken == null) {
      return Promise.reject(new Error())
    }
    return Promise.resolve({ token: accessToken })
  }
}
