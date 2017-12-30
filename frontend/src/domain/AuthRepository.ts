import AccessToken from "./AccessToken";

export default interface AuthRepository {
  setOauthState(state: string): Promise<void>
  getOauthState(): Promise<string>
  fetchAccessToken({ code, state }: { code: string, state: string }): Promise<AccessToken>
  getAccessToken(): Promise<AccessToken>
}
