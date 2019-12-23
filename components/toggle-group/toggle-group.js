import { Children, cloneElement } from 'react'

const ToggleGroup = ({ children, className, value }) => {
  return (
    <div className={className}>
      {value
        ? Children.map(children, child =>
            child.props.value === value
              ? cloneElement(child, { active: true })
              : child
          )
        : children}
      <style jsx>{`
        div {
          display: flex;
        }
      `}</style>
    </div>
  )
}

export default ToggleGroup
