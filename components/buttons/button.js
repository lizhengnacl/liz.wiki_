// Packages
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import cn from 'classnames'

import LoadingDots from '~/components/loading-dots'
import Animation from './button-animation'

import withType from '~/lib/with-type'
import { useDisabled } from '~/lib/with-disabled-context'

const ButtonBase = ({
  Component = 'button',
  typeName = 'text',
  title,
  disabled,
  icon,
  iconAutoSize,
  iconRight,
  iconPush,
  iconNoColorOverride,
  iconNoStrokeOverride = true,
  loading,
  small,
  medium,
  large,
  shadow,
  width,
  children,
  onClick,
  capitalize = true,
  normalStyle = {},
  hoverStyle = {},
  innerRef,
  animation: _animation,
  themeColor,
  type,
  className,
  inputSize,
  ...props
}) => {
  const [animationStartAt, setAnimationStartAt] = useState(null)
  const [animationX, setAnimationX] = useState(null)
  const [animationY, setAnimationY] = useState(null)
  const buttonRef = useRef(null)
  const disabledContext = useDisabled()
  const animation = !(_animation === false) && shadow !== true

  const onAnimationComplete = () => {
    setAnimationStartAt(null)
    setAnimationX(null)
    setAnimationY(null)
  }

  const onButtonClick = ev => {
    if (disabled || disabledContext) return

    if (animation) {
      const ref = innerRef || buttonRef
      if (ref.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setAnimationStartAt(Date.now())
        setAnimationX(ev.clientX - rect.left)
        setAnimationY(ev.clientY - rect.top)
      }
    }

    if (onClick) {
      onClick(ev)
    }
  }

  const restProps = { ...props }

  return (
    <Component
      role="button"
      ref={buttonRef}
      title={title}
      onClick={onButtonClick}
      type={typeName}
      disabled={disabled || disabledContext}
      className={cn(
        'button',
        {
          disabled: disabled || disabledContext,
          shadow,
          small,
          medium,
          'icon-color': !iconNoColorOverride,
          'icon-stroke': !iconNoStrokeOverride,
          loading,
          'auto-size': iconAutoSize,
          capitalize
        },
        className
      )}
      {...(innerRef ? { ref: innerRef } : {})}
      {...restProps}
    >
      {icon && !loading ? <span className="icon">{icon}</span> : null}

      {/* Always show the text to ensure the width is correct.
          The text will be visbility: hidden when in loading state */}
      <span className="text">{children}</span>

      {loading && (
        <span className="loading-dots">
          <LoadingDots size={4} />
        </span>
      )}

      {animation && animationStartAt && (
        <Animation
          key={animationStartAt}
          x={animationX}
          y={animationY}
          onComplete={onAnimationComplete}
        />
      )}

      {/* Dynamic Styles */}
      <style jsx>{`
        /* Order of precendence:
            type="..."
            themeColor
            normalStyle/hoverStyle
        */
        .button {
          /* Use button- variables here because you cannot fallback to existing value
             i.e. you cannot do --themed-fg: var(--themed-fg); */
          --button-fg: ${type
            ? 'var(--themed-fg)'
            : themeColor
            ? '#fff'
            : normalStyle.color || 'var(--geist-background)'};
          --button-bg: ${type
            ? 'var(--themed-bg)'
            : themeColor ||
              normalStyle.backgroundColor ||
              'var(--geist-foreground)'};
          --button-border: ${type
            ? 'var(--themed-border)'
            : themeColor ||
              normalStyle.borderColor ||
              'var(--geist-foreground)'};
        }

        .button:hover {
          /* Use -hover variables here for the same reason */
          --button-fg-hover: ${type
            ? 'var(--button-bg)'
            : themeColor || hoverStyle.color || 'var(--geist-foreground)'};
          --button-bg-hover: ${hoverStyle.backgroundColor || 'transparent'};
          --button-border-hover: ${type
            ? 'var(--button-bg)'
            : themeColor ||
              hoverStyle.borderColor ||
              'var(--geist-foreground)'};
        }
      `}</style>

      <style jsx>{`
        .button {
          /* base */
          appearance: none;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          /* typography */
          text-align: center;
          text-decoration: none;
          line-height: ${inputSize ? '34px' : '38px'};
          white-space: nowrap;
          font-weight: 500;

          /* size */
          min-width: ${width
            ? typeof width === 'number'
              ? width + 'px'
              : width
            : '200px'};
          height: ${large
            ? '50px;'
            : inputSize
            ? 'calc(1.688 * var(--geist-gap))'
            : '40px'};
          padding: 0 ${icon && iconPush && iconRight ? 55 : 25}px 0
            ${icon && iconPush && !iconRight ? 55 : 25}px;
          border-radius: var(--geist-radius);
          font-size: ${large ? '1rem' : '0.875rem'};
          flex-shrink: 0;
          margin: 0;

          /* color */
          color: var(--button-fg);
          background-color: var(--button-bg);
          border: 1px solid var(--button-border);

          /* other */
          transition: all 0.2s ease;
          user-select: none;
          cursor: pointer;
          overflow: hidden;
          outline: none;
        }

        /* Ghost buttons break the rules */
        .button.geist-themed.geist-ghost {
          --button-fg-hover: var(--geist-foreground);
          --button-bg-hover: var(--geist-background);
          --button-border-hover: var(--geist-background);
        }

        /* Secondary buttons break the rules */
        .button.geist-themed.geist-secondary {
          --button-fg: var(--accents-5);
          --button-bg: var(--geist-background);
          --button-border: var(--accents-2);
        }
        .button.geist-themed.geist-secondary.shadow {
          --button-border: transparent;
        }
        .button.geist-themed.geist-secondary:not(.shadow):hover {
          --button-fg-hover: var(--geist-foreground);
          --button-bg-hover: var(--geist-background);
          --button-border-hover: var(--geist-foreground);
        }

        /* Shadow hover styles should be the same as non-hovered */
        .button.shadow:hover {
          --button-fg-hover: var(--button-fg);
          --button-bg-hover: var(--button-bg);
          --button-border-hover: var(--button-border);
        }

        /* Sizes */
        .button.small {
          min-width: ${width
            ? typeof width === 'number'
              ? width + 'px'
              : width
            : 'auto'};
          height: 24px;
          line-height: 22px;
          padding: 0 10px;
        }
        .button.medium {
          min-width: ${width
            ? typeof width === 'number'
              ? width + 'px'
              : width
            : 'auto'};
          height: 32px;
          line-height: 0;
          font-size: 0.875rem;
          padding: 6px 12px;
        }

        /* Shadow modifier */
        .button.shadow {
          font-weight: 400;
          box-shadow: var(--shadow-small);
        }

        /* Button text */
        .button .text {
          position: relative;
          z-index: 1;
        }

        .button.capitalize {
          text-transform: capitalize;
        }

        /* Button icon */
        .button .icon {
          position: absolute;
          display: flex;
          align-items: center;
          top: 0;
          bottom: 0;
          z-index: 1;
          left: ${iconRight ? 'auto' : '22px'};
          right: ${iconRight ? '22px' : 'auto'};
        }
        .button.auto-size .icon :global(svg) {
          height: 20px;
          width: 20px;
        }
        .button.icon-color .icon :global(path) {
          fill: var(--button-fg);
          transition: fill 0.2s ease;
        }
        .button.icon-stroke .icon :global(path) {
          stroke: var(--button-fg);
          transition: stroke 0.2s ease;
        }

        /* Hover style */
        .button:hover {
          color: var(--button-fg-hover);
          background-color: var(--button-bg-hover);
          border-color: var(--button-border-hover);
        }
        .button.icon-color:hover .icon :global(path) {
          fill: var(--button-fg-hover);
        }
        .button.icon-stroke:hover .icon :global(path) {
          stroke: var(--button-fg-hover);
        }
        .button.shadow:hover {
          box-shadow: var(--shadow-medium);
          transform: translate3d(0px, -1px, 0px);
        }

        /* Disabled style */
        .button.disabled {
          background: var(--accents-1);
          border-color: var(--accents-2);
          color: var(--accents-4);
          cursor: not-allowed;
          filter: grayscale(1);
        }
        .button.disabled .icon :global(svg) {
          opacity: 0.4;
        }
        .button.disabled.icon-color .icon :global(path) {
          fill: var(--accents-4);
        }
        .button.disabled.stroke-color .icon :global(path) {
          stroke: var(--accents-4);
        }
        .button.disabled.shadow:hover {
          box-shadow: var(--shadow-medium);
          transform: unset;
        }

        /* loading style */
        .button.loading {
          background: var(--accents-1);
          border-color: var(--accents-2);
          color: var(--accents-4);
          cursor: default;
          pointer-events: none;
          filter: grayscale(1);
        }
        .button.loading .text {
          visibility: hidden;
        }
        .button.loading .loading-dots {
          position: absolute;
          display: inline-flex;
        }
      `}</style>
    </Component>
  )
}

ButtonBase.propTypes = {
  Component: PropTypes.string,
  typeName: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.element,
  iconAutoSize: PropTypes.bool,
  iconRight: PropTypes.bool,
  iconPush: PropTypes.bool,
  iconNoColorOverride: PropTypes.bool,
  iconNoStrokeOverride: PropTypes.bool,
  loading: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool,
  shadow: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  normalStyle: PropTypes.object,
  hoverStyle: PropTypes.object,
  animation: PropTypes.bool,
  themeColor: PropTypes.string
}

const Button = (props, ref) => {
  return <ButtonBase {...props} innerRef={ref} />
}

export default React.forwardRef(
  withType(React.forwardRef(Button), {
    defaultFill: true,
    hasFill: false
  })
)
