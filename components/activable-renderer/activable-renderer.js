import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ActivableRenderer extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    delay: PropTypes.number,
    render: PropTypes.func.isRequired
  }

  static defaultProps = {
    delay: 200
  }

  state = {
    active: this.props.active,
    rendered: this.props.active
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) this.renderAndActivate()
    if (!nextProps.active && this.props.active) this.deactivateAndUnrender()
  }

  componentWillUnmount() {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout)
    }

    if (this.unrenderTimeout) {
      clearTimeout(this.unrenderTimeout)
    }
  }

  renderAndActivate() {
    if (this.unrenderTimeout) clearTimeout(this.unrenderTimeout)
    this.setState({ rendered: true, active: false })
    this.renderTimeout = setTimeout(() => {
      this.setState({ active: true })
    }, 100)
  }

  deactivateAndUnrender() {
    this.setState({ rendered: true, active: false }, () => {
      this.unrenderTimeout = setTimeout(() => {
        try {
          this.setState({ rendered: false })
          this.unrenderTimeout = null
        } catch (e) {
          // nothing to do here
        }

        if (this.props.afterUnrender) {
          this.props.afterUnrender()
        }
      }, this.props.delay)
    })
  }

  render() {
    const { render } = this.props
    const { active, rendered } = this.state
    return rendered ? render({ active }) : null
  }
}
