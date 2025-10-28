import React from 'react'
import HeaderNav from './HeaderNav'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import MobileNav from './MobileNav'
import Filters from './Filters';
import axios from 'axios'
import { useParams, useLocation } from 'react-router-dom'
import Alert from './Alert'
import { TbNurseFilled } from 'react-icons/tb'


export default function Layout({ children, search = false, setSearchData, logo = true, logoEcommerce, setUserType, preview = false, colors = null, goodContrast = null, change = null, setLoading = null, notHeader = false, fixed = false }) {
  const location = useLocation()

  const { ecommerce } = useParams()
  const [headerColor, setHeaderColor] = useState(null);
  const [mainColor, setMainColor] = useState(null);
  const [footerColor, setFooterColor] = useState(null);
  useEffect(() => {
    setHeaderColor(colors?.["header"]);
    setMainColor(colors?.["main"]);
    setFooterColor(colors?.["footer"]);
  }, [colors])


  useEffect(() => {
    if (!ecommerce) {
      setHeaderColor("#075985");
      setMainColor("#FFFFFF");
      setFooterColor("#075985");
    }
    ecommerce && axios.post("/api/show_custom_store.php", {
      ecommerce: ecommerce
    })
      .then((res) => {
        setHeaderColor(res.data.data.header_color)
        setMainColor(res.data.data.main_color)
        setFooterColor(res.data.data.footer_color)
      })
      .catch((res) => console.log(res))
  }, [ecommerce, change, location.pathname])

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

  //alerts
  const [showLoginAlert, setShowLoginAlert] = useState(null)
  const [showCreateProductAlert, setShowCreateProductAlert] = useState(null)
  const [showAddToCartAlert, setShowAddToCartAlert] = useState(null)
  const [showPaymentAlert, setPaymentAlert] = useState(null)

  useEffect(() => {
    const loginSuccess = sessionStorage.getItem('loginSuccess')
    const createProductSuccess = sessionStorage.getItem('createProductSuccess')
    const addToCartSuccess = sessionStorage.getItem('addToCartSuccess')
    const paymentSuccess = sessionStorage.getItem('paymentSuccess')
    if (loginSuccess === 'success') {
      setShowLoginAlert('success')
      sessionStorage.removeItem('loginSuccess')
    }
    if (loginSuccess === 'error') {
      setShowLoginAlert('error')
      sessionStorage.removeItem('loginSuccess')
    }
    if (createProductSuccess === 'success') {
      setShowCreateProductAlert('success')
      sessionStorage.removeItem('createProductSuccess')
    }
    if (addToCartSuccess === 'success') {
      setShowAddToCartAlert('success')
      sessionStorage.removeItem('addToCartSuccess')
    }
    if (paymentSuccess === 'success') {
      setPaymentAlert('success')
      sessionStorage.removeItem('paymentSuccess')
    }
  }, [location])

  useEffect(() => {
    const handleLoginError = () => {
      const loginSuccess = sessionStorage.getItem('loginSuccess')
      if (loginSuccess === 'error') {
        setShowLoginAlert('error')
        sessionStorage.removeItem('loginSuccess')
      }
    }
    window.addEventListener('loginError', handleLoginError)
    return () => window.removeEventListener('loginError', handleLoginError)
  }, [])



  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      {!notHeader && (
        <HeaderNav setLoading={setLoading} preview={preview} color={headerColor} setUserTypeForAdmin={setUserType} setPanelFilter={setPanelFilter} logoEcommerce={logoEcommerce} logo={logo} search={search} setSearchData={setSearchData} setDataCategories={setDataCategories} setWord={setWord} fixed={fixed} />
      )}
      {/* <main className={`${!notHeader && "mt-20"}`}
        style={{ backgroundColor: ecommerce ? "#FFFFFF" : mainColor || "#FFFFFF" }}>
        {children}
      </main> */}
      <main className={` ${fixed && "mt-20"}`}
        style={{ backgroundColor: mainColor || "#FFFFFF" }}>
        {children}
      </main>


      {windowWidth < 500 ? <MobileNav color={footerColor} goodContrast={goodContrast} /> : undefined}
      {panelFilter ? <Filters setSearchData={setSearchData} word={word} setPanelFilter={setPanelFilter} dataCategories={dataCategories} /> : null}
      {windowWidth > 500 && !preview ? !notHeader && <Footer color={footerColor} /> : undefined}
      {showCreateProductAlert && (
        <Alert
          type="toast"
          variant="success"
          title="Producto creado exitosamente"
          duration={4000}
          onClose={() => setShowCreateProductAlert(null)}
          onAccept={() => { }
          }
          onCancel={() => { }}
          show={true}
        />
      )}
      {showAddToCartAlert && (
        <Alert
          type="toast"
          variant="success"
          title="Producto agregado al carrito exitosamente"
          duration={4000}
          onClose={() => setShowAddToCartAlert(null)}
          onAccept={() => { }
          }
          onCancel={() => { }}
          show={true}
        />
      )}
      {showPaymentAlert === "success" && (
        <Alert
          type="toast"
          variant="success"
          title="Pago realizado exitosamente" ñ
          duration={4000}
          onClose={() => setPaymentAlert(null)}
          show={true}
        />
      )}
      {showLoginAlert === "success" && (
        <Alert
          type="toast"
          variant="success"
          title="Inicio de sesión exitoso"
          duration={4000}
          onClose={() => setShowLoginAlert(null)}
          show={true}
        />
      )}

      {showLoginAlert === "error" && (
        <Alert
          type="toast"
          variant="error"
          title="Error al iniciar sesión"
          duration={4000}
          onClose={() => setShowLoginAlert(null)}
          show={true}
        />
      )}
    </div>
  )
}