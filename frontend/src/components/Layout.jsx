import React from 'react'
import HeaderNav from './HeaderNav'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'

export default function Layout({children, search = false, setSearchData}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      
      return () => {
        window.removeEventListener("resize", handleResize);
      };
  }, [windowWidth])
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
    <HeaderNav search={search} setSearchData={setSearchData}/>
    <main className=''>{children}</main>
    {windowWidth < 500 ? <MobileNav/> : undefined}
    {windowWidth > 500 ? <Footer/> : undefined}
    </div>
  )
}