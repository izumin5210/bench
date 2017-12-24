import AccessToken from "./AccessToken";

export default interface AuthRepository {
  fetchAccessToken({ code, state }: { code: string, state: string }): Promise<AccessToken>
  getAccessToken(): Promise<AccessToken>
}
