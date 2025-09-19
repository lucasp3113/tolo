import React from 'react'
import HeaderNav from './HeaderNav'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'
import Filters from './Filters';

export default function Layout({children, search = false, setSearchData, logo = true, logoEcommerce, setUserType}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [panelFilter, setPanelFilter] = useState(false);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      
      return () => {
        window.removeEventListener("resize", handleResize);
      };
  }, [windowWidth])

  /*
      Esto es para pasarle un array con todas las categorias de los productos encontrados a Filters
    */
    const [dataCategories, setDataCategories] = useState(null)

    const [word, setWord] = useState(null)

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
    <HeaderNav setUserTypeForAdmin={setUserType} setPanelFilter={setPanelFilter} logoEcommerce={logoEcommerce} logo={logo} search={search} setSearchData={setSearchData} setDataCategories={setDataCategories} setWord={setWord}/>
    <main className=''>{children}</main>
    {windowWidth < 500 ? <MobileNav /> : undefined}
    {panelFilter ? <Filters setSearchData={setSearchData} word={word} setPanelFilter={setPanelFilter} dataCategories={dataCategories} /> : null}
    {windowWidth > 500 ? <Footer/> : undefined}
    </div>
  )
}