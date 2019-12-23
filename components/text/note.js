import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

import Text from '~/components/text'
import withType from '~/lib/with-type'

const Note = ({
  children,
  className,
  type = 'default',
  fill,
  label,
  small,
  center,
  ...props
}) => {
  return (
    <div className={cn('note', className, { small, fill, center })} {...props}>
      {label !== false && (
        <Text bold span uppercase>
          {(label && `${label}: `) ||
            (type === 'success' && `Success: `) ||
            (type === 'error' && `Error: `) ||
            (type === 'warning' && `Warning: `) ||
            `Note: `}
        </Text>
      )}

      {children}

      <style jsx>{`
        .note {
          padding: ${small
            ? 'var(--geist-gap-quarter) var(--geist-gap-half)'
            : 'var(--geist-gap-half) var(--geist-gap)'};
          border-radius: var(--geist-radius);
          background: var(--themed-bg);
          border: 1px solid var(--themed-border);
          font-size: 16px;
          line-height: 1.8;
          color: var(--themed-fg);
        }

        .note:not(.geist-themed) {
          --themed-border: var(--accents-2);
        }

        .note.fill:not(.geist-themed) {
          --themed-bg: var(--geist-foreground);
          --themed-fg: var(--geist-background);
          --themed-border: var(--geist-foreground);
        }

        .note__type {
          text-transform: uppercase;
          font-weight: 500;
        }

        .note.small {
          padding: 5px var(--geist-gap-half);
        }

        .note.center {
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Note.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hideLabel: PropTypes.bool,
  type: PropTypes.oneOf([
    'secondary',
    'success',
    'error',
    'warning',
    'default',
    'lite'
  ]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default withType(Note)
