import { Component } from 'react'
import PropTypes from 'prop-types'
import { HEADER_HEIGHT } from '~/lib/constants'
import IObserver from '../intersection-observer'

class Observer extends Component {
  static propTypes = {
    children: PropTypes.node,
    fragment: PropTypes.string,
    onIntersect: PropTypes.func,
    value: PropTypes.string
  }

  handleIntersect = intersectEntry => {
    if (intersectEntry.isIntersecting && this.props.onIntersect) {
      this.props.onIntersect(this.props.value)
    }
  }

  render() {
    return (
      <IObserver
        onIntersect={this.handleIntersect}
        rootMargin="-120px 0% -100% 0%"
        threshold={[0, 1]}
        render={({ innerRef }) => {
          return (
            <div ref={innerRef}>
              <span id={this.props.fragment} />
              {this.props.children}
              <style jsx>{`
                div {
                  position: relative;
                }

                span {
                  position: absolute;
                  top: -${HEADER_HEIGHT + 24}px;
                }
              `}</style>
            </div>
          )
        }}
      />
    )
  }
}

export default Observer
