import React, { CSSProperties, ReactNode } from 'react'

interface Props {
    children: ReactNode,
    styles?:CSSProperties
}

const Sectioin = (props:Props) => {
    const {children, styles} = props;
  return (
    <div style={styles}>
      {children}
    </div>
  )
}

export default Sectioin
