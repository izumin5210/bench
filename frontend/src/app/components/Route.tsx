import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux";
import { Route as ReactRouterRoute, Redirect, RouteComponentProps } from "react-router-dom"

import { RootState } from "app/store"
import { actions } from "app/store/auth"
import { getAccessTokenFetchStatus } from "app/store/auth/selectors"
import FetchStatus from "domain/FetchStatus"
import { compose, branch, lifecycle, renderNothing, renderComponent } from "recompose"

interface NeedsProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
  private?: boolean
  path?: string
  exact?: boolean
  strict?: boolean
}

interface InjectedProps {
  fetchStatus: FetchStatus
  getAccessToken: () => any
}

type Props = NeedsProps & InjectedProps

//  Enhancer
//================================================================
const withPrivateBranch = branch(
  (props: Props) => !props.private,
  renderComponent(ReactRouterRoute),
)

const withLifecycle = lifecycle<Props, {}, {}>({
  componentDidMount(this) {
    if (this.props.fetchStatus == "none") {
      this.props.getAccessToken()
    }
  },
})

const withHideBranch = branch(
  ({ fetchStatus }: Props) => fetchStatus == "none" || fetchStatus == "loading",
  renderNothing,
)

const enhance = compose<Props, Props>(
  withPrivateBranch,
  withLifecycle,
  withHideBranch,
)

//  Component
//================================================================
const withConnector = connect(
  (state: RootState) => ({
    fetchStatus: getAccessTokenFetchStatus(state),
  }),
  (dispatch: Dispatch<any>) => ({
    getAccessToken: () => dispatch(actions.getAccessToken({}))
  }),
)

const createRenderFunc = (Component: React.ComponentType<any>, status: FetchStatus) =>
  (props: RouteComponentProps<any>) => {
    if (status != "loaded") {
      return (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
    }
    return (<Component {...props} />)
  }

const Route = ({ component, fetchStatus, ...rest }: Props) => (
  <ReactRouterRoute
    {...rest}
    render={createRenderFunc(component, fetchStatus)}
  />
)

const EnhancedRoute = enhance(Route)
const ConnectedRoute = withConnector(EnhancedRoute)

export { EnhancedRoute as Route }
export default ConnectedRoute
