import cns from 'classnames'
import PropTypes from 'prop-types'

const ToggleItem = ({ active, children }) => {
  return (
    <div className={cns('toggle', { active })}>
      {children}
      <style jsx>{`
        .toggle {
          background-color: transparent;
          border-bottom: 1px solid #eaeaea;
          border-left: 0;
          border-right: 1px solid #eaeaea;
          border-top: 1px solid #eaeaea;
          color: #999;
          cursor: pointer;
          display: inline-flex;
          flex: 1;
          font-size: 12px;
          height: 24px;
          justify-content: center;
          line-height: 24px;
          outline: 0;
          position: relative;
          text-align: center;
          transition: color 0.12s ease-in-out;
          white-space: nowrap;
        }

        .toggle:hover {
          color: #000;
        }

        .toggle.active {
          color: #000;
          cursor: default;
          font-weight: 500;
        }

        .toggle > :global(*) {
          padding: 0 12px;
        }

        .toggle:first-child {
          border-bottom-left-radius: 5px;
          border-left: 1px solid #eaeaea;
          border-top-left-radius: 5px;
        }

        .toggle:last-child {
          border-bottom-right-radius: 5px;
          border-top-right-radius: 5px;
        }

        .toggle :global(a) {
          color: inherit;
          text-decoration: none;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

ToggleItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node
}

export default ToggleItem
