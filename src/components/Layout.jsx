import React from 'react'
import HeaderNav from './HeaderNav'
import Footer from '../components/Footer'

export default function Layout({children}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
    <HeaderNav/>
    <main>{children}</main>
    <Footer/>
    </div>
  )
}
