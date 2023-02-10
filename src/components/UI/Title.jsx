import React from 'react'

function Title(props) {
  return (
    <div className={`${props.className} font-dancing font-bold  leading-[4.2rem]`}>{props.children}</div>
  )
}
export default Title;