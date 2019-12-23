import { useMemo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

export const types = [
  'secondary',
  'warning',
  'success',
  'default',
  'alert',
  'error',
  'lite',
  'ghost',
  'alert',
  'violet'
]

const getCn = (type: string, fill: boolean) => {
  if (!type || typeof type !== 'string') return null

  // Sanitize
  type = type.toLowerCase()

  // Not a valid type prop
  if (!types.includes(type)) return null

  return ['geist-themed', `geist-${type}`, fill ? `geist-${type}-fill` : null]
}

const withType = (Component: any, opts: any = {}) => {
  const Comp = ({ className, ...props }: any, ref: any) => {
    // Do not immediately destructure these props, they should still be passed
    const { type } = props
    let { fill = opts.defaultFill || undefined } = props

    // Disable fill styling if hasFill option is false
    if (opts.hasFill === false) {
      fill = opts.defaultFill || false
    }

    // Combine any possible className prop and the generated .geist-themed classnames
    const classNames = useMemo(() => {
      return cn(getCn(type, fill), className)
    }, [type, fill, className])

    return <Component className={classNames} {...props} ref={ref} />
  }

  Comp.getInitialProps = Component.getInitialProps

  return Comp
}

withType.propTypes = {
  Component: PropTypes.element.isRequired,
  opts: PropTypes.shape({
    hasFill: PropTypes.bool,
    defaultFill: PropTypes.bool
  })
}

export default withType