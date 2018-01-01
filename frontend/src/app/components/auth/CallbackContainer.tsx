import * as React from "react"
import { withRouter, RouteComponentProps, Redirect } from "react-router"
import { connect } from "react-redux"
import { Dispatch } from "redux";
import { compose, lifecycle, branch, renderNothing } from "recompose"
import { parse } from "query-string"

import { RootState } from "app/store"
import { actions } from "app/store/auth"
import { isAccessTokenFetched } from "app/store/auth/selectors"

interface NeedsProps {
}

interface InjectedProps {
  accessTokenFetched: boolean
  fetchAccessToken: () => any
}

type Props = NeedsProps & InjectedProps & RouteComponentProps<any>

//  Component
//================================================================
export default compose<Props, Props>(
  withRouter,
  connect(
    (state: RootState) => ({
      accessTokenFetched: isAccessTokenFetched(state),
    }),
    (dispatch: Dispatch<any>, props: NeedsProps & RouteComponentProps<any>) => ({
      fetchAccessToken: () => {
        const { code } = parse(props.location.search)
        dispatch(actions.fetchAccessToken({ code }))
      },
    }),
  ),
  lifecycle<Props, {}, {}>({
    componentDidMount(this) {
      this.props.fetchAccessToken()
    }
  }),
  branch(
    (props: Props) => !props.accessTokenFetched,
    renderNothing,
  ),
)(
  () => (<Redirect to="/" />),
)
