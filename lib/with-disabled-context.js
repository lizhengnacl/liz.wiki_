import React, { useContext } from 'react'

export const DisabledContext = React.createContext()
export const useDisabled = () => useContext(DisabledContext)
