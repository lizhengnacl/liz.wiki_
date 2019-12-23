import React, { Component } from 'react'
import cns from 'classnames'
import PropTypes from 'prop-types'
import MenuPositioner, { POSITIONS, ORIENTATIONS } from '../menu-positioner'
import ClickOutside from '../click-outside'

class Menu extends Component {
  static propTypes = {
    active: PropTypes.bool,
    align: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    orientation: PropTypes.string,
    position: PropTypes.string,
    triangleSize: PropTypes.number,
    withPortal: PropTypes.bool
  }

  static defaultProps = {
    active: false,
    align: POSITIONS.AUTO,
    className: '',
    triangleSize: 10,
    orientation: ORIENTATIONS.VERTICAL,
    position: POSITIONS.AUTO,
    withPortal: false
  }

  static getDerivedStateFromProps(props) {
    return { active: props.active }
  }

  state = {
    active: this.props.active
  }

  handleClickOutside = () => {
    if (this.props.onClickOutside) {
      this.props.onClickOutside()
    } else {
      this.handleHide()
    }
  }

  handleShow = () => {
    this.setState({ active: true })
  }

  handleHide = () => {
    this.setState({ active: false })
  }

  handleProviderRef = handle => node => {
    this.triggerNode = node
    handle(node)
  }

  handleMenuRef = handle => node => {
    this.menuElement = node
    handle(node)
  }

  renderMenu = ({ active, position, align }) => {
    const { className, children, triangleSize, fit, style, tip } = this.props
    const halfHypo = Math.sqrt(triangleSize ** 2 + triangleSize ** 2) / 2
    const bounds = this.triggerNode && this.triggerNode.getBoundingClientRect()
    const triggerWidth = bounds ? bounds.width : 0

    return (
      <ClickOutside
        active={active}
        onClick={this.handleClickOutside}
        render={({ innerRef }) => (
          <ul
            className={cns({ active, fit }, position, align, className)}
            ref={this.handleMenuRef(innerRef)}
            style={style}
          >
            {tip && (
              <div className="triangle">
                <Triangle />
              </div>
            )}
            {children}
            <style jsx>{`
              ul {
                background: #ffffff;
                border-radius: 5px;
                box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.02);
                list-style: none;
                margin: 0;
                padding: 8px 0;
                position: relative;
                opacity: 0;
                visibility: hidden;
                transform: translateY(0);
                transition: opacity 0.2s ease, transform 0.2s ease,
                  box-shadow 0.5s ease;
                cursor: default;
              }
              ul.fit {
                width: ${triggerWidth}px;
              }
              ul.bottom {
                margin-top: ${halfHypo}px;
              }
              ul.top {
                margin-bottom: ${halfHypo}px;
              }
              ul.active {
                opacity: 1;
                visibility: visible;
                box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.12);
              }
              ul.active.bottom {
                transform: translateY(3px);
              }
              ul.active.top {
                transform: translateY(-3px);
              }
              .triangle {
                display: block;
                position: absolute;
                right: 2px;
                bottom: 100%;
                line-height: 11px;
                z-index: 1;
                text-align: center;
              }
            `}</style>
          </ul>
        )}
      />
    )
  }

  renderPositioner = ({ handleProviderRef, positionedRenderer }) =>
    this.props.render({
      active: this.state.active,
      handleProviderRef: this.handleProviderRef(handleProviderRef),
      hide: this.handleHide,
      show: this.handleShow,
      menu: positionedRenderer(this.renderMenu)
    })

  render() {
    return (
      <MenuPositioner
        active={this.state.active}
        align={this.props.align}
        orientation={this.props.orientation}
        position={this.props.position}
        render={this.renderPositioner}
        withPortal={this.props.withPortal}
      />
    )
  }
}

export default Menu

const Triangle = ({ direction }, { darkBg = false }) => (
  <svg
    width="24"
    height="12"
    viewBox="0 0 24 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={darkBg ? '#000' : '#fff'}
      fillRule="evenodd"
      d={direction === 'down' ? 'M20 0l-8 8-12-12' : 'M20 12l-8-8-12 12'}
    />
  </svg>
)

Triangle.contextTypes = {
  darkBg: PropTypes.bool
}
