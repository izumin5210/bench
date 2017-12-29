import * as React from "react"
import { compose, branch, renderComponent } from "recompose"

interface Props {
  githubClientId: string
  oauthState: string | null
}

const AuthLink = ({ githubClientId, oauthState }: Props) => (
  <a href={`https://github.com/login/oauth/authorize?client_id=${githubClientId}&state=${oauthState}`}>
    Authorize with GitHub account
  </a>
)

const enhance = compose<Props, Props>(
  branch(
    ({ oauthState }: Props) => oauthState == null,
    renderComponent(() => (<a>Authorize with GitHub account</a>)),
  ),
)

export default enhance(AuthLink)
