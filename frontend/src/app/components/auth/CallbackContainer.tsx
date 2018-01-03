import * as React from "react"
import { RouteComponentProps, Redirect } from "react-router"
import { connect } from "react-redux"
import { Dispatch } from "redux";
import { compose, lifecycle, branch, renderNothing, renderComponent } from "recompose"
import { parse } from "query-string"

import FetchStatus from "domain/FetchStatus";

import { RootState } from "app/store"
import { actions } from "app/store/auth"
import { getAccessTokenFetchStatus } from "app/store/auth/selectors"

interface NeedsProps {
}

interface InjectedProps {
  fetchStatus: FetchStatus
  fetchAccessToken: (params: { state: string, code: string }) => any
}

type Props = NeedsProps & InjectedProps & RouteComponentProps<any>

//  Enhancer
//================================================================
const withLifecycle = lifecycle<Props, {}, {}>({
  componentDidMount(this) {
    const { fetchStatus } = this.props
    if (fetchStatus != "loaded" && fetchStatus != "failed") {
      const { state, code } = parse(this.props.location.search)
      this.props.fetchAccessToken({ state, code })
    }
  }
})

const withHideBranch = branch(
  ({ fetchStatus }: Props) => fetchStatus != "loaded" && fetchStatus != "failed",
  renderNothing,
)

const withRedirectToLoginBranch = branch(
  ({ fetchStatus }: Props) => fetchStatus == "failed",
  renderComponent(() => (<Redirect to="/login" />)),
)

const enhance = compose<Props, Props>(
  withLifecycle,
  withHideBranch,
  withRedirectToLoginBranch,
)

//  Component
//================================================================
const withConnector = connect(
  (state: RootState) => ({
    fetchStatus: getAccessTokenFetchStatus(state),
  }),
  (dispatch: Dispatch<any>) => ({
    fetchAccessToken: (params: { state: string, code: string }) => dispatch(actions.fetchAccessToken(params)),
  }),
)

export const CallbackContainer = enhance(() => (<Redirect to="/" />))
export default withConnector(CallbackContainer)
