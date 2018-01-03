import { Config } from "app/types"

const githubClientId = process.env.GITHUB_CLIENT_ID || ""

export default function loadConfig(): Config {
  switch (process.env.NODE_ENV) {
    case "production":
      return {
        apiEndpoint: "https://bench.izum.in",
        githubClientId,
      }
    default:
      return {
        apiEndpoint: "http://localhost:3000",
        githubClientId,
      }
  }
}
