import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Link extends Component {
  static contextTypes = {
    route: PropTypes.string,
    linkHandler: PropTypes.func,
  }

  handleClick = (evt) => {
    evt.preventDefault()
    this.context.linkHandler(this.props.to)
  }

  render() {
    const activeClass = this.context.route === this.props.to ? 'active' : ''
    return (
      <a href="#" onClick={this.handleClick} className={activeClass}>
        {this.props.children}
      </a>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
}
