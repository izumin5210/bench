
const keys = {
  accessToken: "accessToken",
}

export function setAccessToken(token: string) {
  localStorage.setItem(keys.accessToken, token)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(keys.accessToken)
}
