const keys = {
  accessToken: "accessToken",
  oauthState: "oauthState",
}

export function setOauthState(state: string) {
  localStorage.setItem(keys.oauthState, state)
}

export function getOauthState(): string | null {
  return localStorage.getItem(keys.oauthState)
}

export function setAccessToken(token: string) {
  localStorage.setItem(keys.accessToken, token)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(keys.accessToken)
}
