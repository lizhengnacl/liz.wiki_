import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'

// Constants (not overridable)
const cap = 'round'
const join = 'round'

const withIcon = (icon, iconFill, opts = {}) => {
  const {
    color: defaultColor,
    secondary: defaultSecondary,
    size: defaultSize,
    fill: defaultFill
  } = opts

  const Icon = props => {
    const {
      size = defaultSize || '24px',
      color = defaultColor || 'currentColor',
      secondary = defaultSecondary || 'var(--geist-background)',
      weight = 'normal',
      fill = defaultFill,
      align,
      ...restProps
    } = props

    delete restProps.fill
    delete restProps.stroke
    delete restProps.width
    delete restProps.height

    const strokeWidth = useMemo(() => {
      if (weight === 'bold') {
        return 2
      } else if (props.weight === 'light') {
        return 1
      }

      return 1.5
    }, [weight])

    const verticalAlign = useMemo(() => {
      if (!align) return null

      if (align === 'top') {
        return 'text-top'
      } else if (align === 'bottom') {
        return 'text-bottom'
      } else if (align === 'middle') {
        return 'middle'
      }

      return null
    }, [align])

    if (fill && iconFill) {
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap={cap}
          strokeLinejoin={join}
          shapeRendering="geometricPrecision"
          {...restProps}
          style={{
            color,
            '--geist-fill': 'currentColor',
            '--geist-stroke': secondary,
            verticalAlign,
            ...restProps.style
          }}
          dangerouslySetInnerHTML={{
            __html: iconFill === true ? icon : iconFill
          }}
        />
      )
    }

    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap={cap}
        strokeLinejoin={join}
        fill="none"
        shapeRendering="geometricPrecision"
        {...restProps}
        style={{
          color,
          verticalAlign
        }}
        dangerouslySetInnerHTML={{
          __html: icon
        }}
      />
    )
  }

  Icon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
    secondary: PropTypes.string,
    weight: PropTypes.oneOf(['light', 'normal', 'bold']),
    align: PropTypes.oneOf(['top', 'bottom', 'middle'])
  }

  const memoIcon = memo(Icon)
  memoIcon.hasFill = !!iconFill

  return memoIcon
}

export default withIcon
