import React, { Component } from 'react'

const noop = () => {}

export default class DragHandler extends Component {
  static defaultProps = {
    onDrag: noop,
    onDragStart: noop,
    onDragEnd: noop
  }

  state = {
    isDragging: false
  }

  componentWillUnmount = () => {
    this.endDrag()
  }

  ref = React.createRef()

  startDrag = evt => {
    this.setState({ isDragging: true })
    window.addEventListener('mousemove', this.triggerRangeChange)
    window.addEventListener('touchmove', this.triggerRangeChange)
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('touchend', this.endDrag)

    this.toggleSelection('none')

    const startValue = evt ? this.getValueFromMouseEvent(evt) : null
    this.props.onDragStart(startValue)
  }

  endDrag = evt => {
    if (evt) {
      this.triggerRangeChange(evt)
    }

    this.setState({ isDragging: false })
    window.removeEventListener('mousemove', this.triggerRangeChange)
    window.removeEventListener('touchmove', this.triggerRangeChange)
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('touchend', this.endDrag)

    this.toggleSelection('')

    const endValue = evt ? this.getValueFromMouseEvent(evt) : null
    this.props.onDragEnd(endValue)
  }

  toggleSelection = value => {
    let body = document.getElementsByTagName('body')[0]
    body.style['user-select'] = value
    body.style['-webkit-user-select'] = value
    body.style['-moz-user-select'] = value
    body.style['-ms-user-select'] = value
  }

  getValueFromMouseEvent = mouseEvent => {
    return this.getHorizontalValue(mouseEvent.pageX)
  }

  triggerRangeChange = mouseEvent => {
    this.props.onDrag(this.getValueFromMouseEvent(mouseEvent))
  }

  getHorizontalValue = mouseX => {
    const rect = this.ref.current.getBoundingClientRect()
    const scrollX =
      window.pageXOffset !== undefined
        ? window.pageXOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollLeft
    let dLeft = mouseX - (rect.left + scrollX)
    dLeft = Math.max(dLeft, 0)
    dLeft = Math.min(dLeft, rect.width)

    return dLeft / rect.width
  }

  render() {
    return (
      <div
        className="drag-handler"
        ref={this.ref}
        onMouseDown={this.startDrag}
        onTouchStart={this.startDrag}
        onMouseMove={this.handleIntentMove}
      >
        <style jsx>
          {`
            .drag-handler {
              width: 100%;
              height: 14px;
              background: transparent;
              cursor: pointer;
            }

            @media (max-width: 992px) {
              height: 18px;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }
          `}
        </style>
      </div>
    )
  }
}
