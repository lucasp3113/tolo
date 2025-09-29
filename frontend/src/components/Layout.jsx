import React from 'react'
import HeaderNav from './HeaderNav'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'
import Filters from './Filters';
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function Layout({ children, search = false, setSearchData, logo = true, logoEcommerce, setUserType, preview = false, colors = null   }) {
  const {ecommerce} = useParams()
  const [headerColor, setHeaderColor] = useState(null);
  const [mainColor, setMainColor] = useState(null);
  const [footerColor, setFooterColor] = useState(null);
  useEffect(() => {
    setHeaderColor(colors?.["header"]);
    setMainColor(colors?.["main"]);
    setFooterColor(colors?.["footer"]);
  }, [colors])

  useEffect(() => {
    axios.post("/api/show_custom_store.php", {
      ecommerce: ecommerce
    })
      .then((res) => {
        console.log(res)
        console.log(ecommerce)
        setHeaderColor(res.data.data.header_color)
        setMainColor(res.data.data.main_color)
        setFooterColor(res.data.data.footer_color)
      })
      .catch((res) => console.log(res))
  }, [])

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
      <HeaderNav preview={preview} color={headerColor} setUserTypeForAdmin={setUserType} setPanelFilter={setPanelFilter} logoEcommerce={logoEcommerce} logo={logo} search={search} setSearchData={setSearchData} setDataCategories={setDataCategories} setWord={setWord} />
      <main className='' style={{ backgroundColor: mainColor || "FFFFFF" }}>{children}</main>
      {windowWidth < 500 ? <MobileNav color={footerColor}/> : undefined}
      {panelFilter ? <Filters setSearchData={setSearchData} word={word} setPanelFilter={setPanelFilter} dataCategories={dataCategories} /> : null}
      {windowWidth > 500 && !preview ? <Footer color={footerColor}/> : undefined}
    </div>
  )
}