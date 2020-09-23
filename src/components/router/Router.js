import React, { Component } from 'react'
import PropTypes from 'prop-types'

const getCurrentPath = () => {
  const path = document.location.pathname
  return path.substring(path.lastIndexOf('/'))
}

export class Router extends Component {
  state = {
    route: getCurrentPath(),
  }

  handleLinkClick = (route) => {
    this.setState({ route })
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', route)
  }

  componentDidMount() {
    window.onpopstate = () => {
      this.setState({ route: getCurrentPath() })
    }
  }

  static childContextTypes = {
    route: PropTypes.string,
    linkHandler: PropTypes.func,
  }

  getChildContext() {
    return {
      route: this.state.route,
      linkHandler: this.handleLinkClick,
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
