import { List } from '~/components/list'

export default function Quickstarts({ children }) {
  return (
    <>
      <br />
      <List columnsDesktop={2} columnsTablet={2} columnsMobile={1}>
        {children}
      </List>
    </>
  )
}
