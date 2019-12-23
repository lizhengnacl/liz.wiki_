import React, { Component, cloneElement, Children } from 'react'
import PropTypes from 'prop-types'

class TableHead extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  }

  render() {
    const { children, innerRef, ...other } = this.props
    return (
      <thead {...other} ref={innerRef}>
        {Children.map(children, (child, index) => {
          if (!child) return null
          return cloneElement(child, {
            column: index,
            tagName: 'th'
          })
        })}
      </thead>
    )
  }
}

export default TableHead
