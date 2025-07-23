import React from 'react'
import HeaderNav from './HeaderNav'

export default function Layout({children}) {
  return (
    <>
    <HeaderNav/>
    <main>{children}</main>
    </>
  )
}
