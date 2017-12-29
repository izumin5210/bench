import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux";
import { compose, lifecycle } from "recompose"

import { RootState } from "app/store"
import { actions } from "app/store/auth"
import { getOauthState } from "app/store/auth/selectors"

import AuthLink from "./AuthLink"

interface NeedsProps {
  githubClientId: string
}

interface InjectedProps {
  oauthState: string | null
  createOauthState: () => any
}

type Props = NeedsProps & InjectedProps

//  Component
//================================================================
const LoginPage = compose<Props, Props>(
  lifecycle<Props, {}, {}>({
    componentDidMount(this) {
      this.props.createOauthState()
    }
  }),
)(
  ({ githubClientId, oauthState }: Props) => (
    <div>
      <h1>Login</h1>
      <AuthLink {...{ githubClientId, oauthState }} />
    </div>
  ),
)

//  Container
//================================================================
const withConnector = connect(
  (state: RootState) => ({
    oauthState: getOauthState(state),
  }),
  (dispatch: Dispatch<any>) => ({
    createOauthState: () => dispatch(actions.createOauthState({})),
  }),
)

export default withConnector(LoginPage)
