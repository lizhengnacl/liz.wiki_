import { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Portal from '../portal'
import ActivableRenderer from '../activable-renderer'
import getViewport from '~/lib/utils/get-viewport'
import isClient from '~/lib/utils/is-client'

export const POSITIONS = {
  AUTO: 'auto',
  BOTTOM: 'bottom',
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top'
}

export const ORIENTATIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
}

export default class MenuPositioner extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    activeRenderDelay: PropTypes.number,
    align: PropTypes.oneOf(Object.values(POSITIONS)),
    className: PropTypes.string,
    orientation: PropTypes.oneOf(Object.values(ORIENTATIONS)),
    position: PropTypes.oneOf(Object.values(POSITIONS)),
    render: PropTypes.func.isRequired,
    withPortal: PropTypes.bool
  }

  static defaultProps = {
    activeRenderDelay: 200,
    align: POSITIONS.AUTO,
    orientation: ORIENTATIONS.VERTICAL,
    position: POSITIONS.AUTO,
    withPortal: true
  }

  calculatedAlign = null
  calculatedPosition = null
  providerBounds = {}
  providerNode = null

  componentDidMount() {
    this.calculateAlignAndPosition(this.props)
    if (this.props.active) {
      this.forceUpdate()
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    this.calculateAlignAndPosition(nextProps)
  }

  calculateAlignAndPosition = props => {
    if (
      this.providerNode &&
      props.active === true &&
      (props.align === POSITIONS.AUTO || props.position === POSITIONS.AUTO)
    ) {
      const { height: wh, width: ww } = getViewport()
      this.providerBounds = this.providerNode.getBoundingClientRect()
      const { top, left, height, width } = this.providerBounds

      this.calculatedAlign =
        this.props.orientation === ORIENTATIONS.VERTICAL
          ? left <= ww / 2 - width / 2
            ? POSITIONS.LEFT
            : POSITIONS.RIGHT
          : top > wh / 2 - height / 2
          ? POSITIONS.BOTTOM
          : POSITIONS.TOP

      this.calculatedPosition =
        this.props.orientation === ORIENTATIONS.VERTICAL
          ? top > wh / 2 - height / 2
            ? POSITIONS.TOP
            : POSITIONS.BOTTOM
          : left <= ww / 2 - width / 2
          ? POSITIONS.RIGHT
          : POSITIONS.LEFT
    }
  }

  getAlign = () =>
    this.props.align === POSITIONS.AUTO
      ? this.calculatedAlign
      : this.props.align

  getPosition = () =>
    this.props.position === POSITIONS.AUTO
      ? this.calculatedPosition
      : this.props.position

  handleProviderRef = node => {
    this.providerNode = node
  }

  positionedRenderer = renderContent => (
    <ActivableRenderer
      active={this.props.active}
      delay={this.props.activeRenderDelay}
      render={({ active }) => {
        const className = cn(
          'positioner',
          `align-${this.getAlign()}`,
          `position-${this.getPosition()}`,
          className
        )
        return this.renderWithPortal(
          <div className={className}>
            {renderContent({
              active,
              align: this.getAlign(),
              position: this.getPosition()
            })}
            <style jsx>{`
              .positioner {
                position: absolute;
                z-index: 900;
              }

              .position-bottom {
                top: 100%;
              }

              .position-bottom:not(.align-center):not(.align-left):not(.align-right) {
                left: 50%;
                transform: translate(-50%);
              }

              .position-bottom.align-center {
                left: 50%;
                transform: translate(-50%);
              }

              .position-bottom.align-left {
                left: 0;
              }

              .position-bottom.align-right {
                right: 0;
              }

              .position-top {
                bottom: 100%;
              }

              .position-top:not(.align-center):not(.align-left):not(.align-right) {
                left: 50%;
                transform: translate(-50%);
              }

              .position-top.align-center {
                left: 50%;
                transform: translate(-50%);
              }

              .position-top.align-left {
                left: 0;
              }

              .position-top.align-right {
                right: 0;
              }

              .position-left {
                right: 100%;
              }

              .position-left:not(.align-center):not(.align-top):not(.align-bottom) {
                top: 50%;
                transform: translateY(-50%);
              }

              .position-left.align-center {
                top: 50%;
                transform: translateY(-50%);
              }

              .position-left.align-top {
                top: 0;
                transform: none;
              }

              .position-left.align-bottom {
                bottom: 0;
              }

              .position-right {
                left: 100%;
              }

              .position-right:not(.align-center):not(.align-top):not(.align-bottom) {
                top: 50%;
                transform: translateY(-50%);
              }

              .position-right.align-center {
                top: 50%;
                transform: translateY(-50%);
              }

              .position-right.align-top {
                top: 0;
              }

              .position-right.align-bottom {
                bottom: 0;
              }
            `}</style>
          </div>
        )
      }}
    />
  )

  renderWithPortal = content => {
    if (this.props.withPortal) {
      const { scrollX, scrollY } = isClient() ? window : {}
      const style = {
        height: this.providerBounds.height,
        left: this.providerBounds.left + scrollX || 0,
        position: 'absolute',
        top: this.providerBounds.top + scrollY || 0,
        width: this.providerBounds.width
      }

      return (
        <Portal>
          <div style={style}>{content}</div>
        </Portal>
      )
    } else {
      return content
    }
  }

  render() {
    return this.props.render({
      align: this.getAlign(),
      handleProviderRef: this.handleProviderRef,
      position: this.getPosition(),
      positionedRenderer: this.positionedRenderer
    })
  }
}
