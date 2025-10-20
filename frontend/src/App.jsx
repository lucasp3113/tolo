import './App.css';
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import EcommerceDashboard from './pages/EcommerceDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';
import CreateProduct from './pages/CreateProduct';
import ProductCRUD from './pages/ProductCRUD';
import Settings from './pages/Settings';
import { DarkModeProvider } from './components/DarkModeProvider';
import ChangePassword from './pages/ChangePassword';
import { useState } from 'react';
import Product from './pages/Product';
import ShoppingCart from './pages/ShoppingCart';
import AdminPanel from './pages/AdminPanel';
import ChangeUser from './pages/ChangeUser';
import ChangeEcommerce from './pages/ChangeEcommerce';
import ProfilePicture from './pages/ProfilePicture';
import Notifications from './pages/Notifications';
import CustomizeStore from './pages/CustomizeStore';
import PaymentsHistory from './pages/PaymentsHistory';
import Maps from './pages/Maps';
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  //pasar el tipo de usuario de header nav, a layaut, de layaut a home, para verificar si es admin
  const [userType, setUserType] = useState(null);
  const admin = userType === "admin" ? true : false;

  /*esto es para conectar la peticion q hace el formualrio de busqueda en el
    componente HeaderNav con la page Home, para renderizar los productos
  */
  const [searchData, setSearchData] = useState(null)

  //esto es para cambiar de color la pagina
  const [colors, setColors] = useState(null)
  const [change, setChange] = useState(0);

  //loading
  const [loading, setLoading] = useState(false);

  return (
    <div className="Tolo">
      <GoogleOAuthProvider clientId="611656355931-jtjpo3d30ueql5p97bc6n43l1m3578ob.apps.googleusercontent.com">
        <DarkModeProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route
                  path="/:ecommerce?"
                  element={
                    <Layout setLoading={setLoading} search={true} setUserType={setUserType} setSearchData={setSearchData}>
                      <Home loading={loading} searchData={searchData} setSearchData={setSearchData} userType={admin} />
                    </Layout>
                  }
                />
                <Route
                  path="/:ecommerce?/login/"
                  element={
                    <Layout setUserType={setUserType}>
                      <Login />
                    </Layout>
                  }
                />
                <Route
                  path="/:ecommerce?/register/"
                  element={
                    <Layout >
                      <Register />
                    </Layout>
                  }
                />
                <Route
                  path="/:ecommerce?/seller_dashboard/"
                  element={
                    <Layout >
                      <ProtectedRoute>
                        <SellerDashboard />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route
                  path="/:ecommerce?/notifications/"
                  element={
                    <Layout >
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    </Layout>
                  }
                />
                <Route path='/:ecommerce?/ecommerce_dashboard/' element={
                  <Layout >
                    <ProtectedRoute>
                      <EcommerceDashboard />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path='/:ecommerce?/create_product/' element={
                  <Layout>
                    <ProtectedRoute>
                      <CreateProduct />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path='/:ecommerce?/product_crud/' element={
                  <Layout >
                    <ProtectedRoute>
                      <ProductCRUD />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path='/:ecommerce?/settings/' element={
                  <Layout >
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  </Layout>
                } />
                <Route path='/:ecommerce?/change_password' element={
                  <Layout >
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  </Layout>
                }>
                </Route>
                <Route path='/:ecommerce?/product/:id' element={
                  <Layout>
                    <Product />
                  </Layout>
                }>
                </Route>
                <Route path='/:ecommerce?/shopping_cart/' element={
                  <Layout logo={false} >
                    <ProtectedRoute>
                      <ShoppingCart />
                    </ProtectedRoute>
                  </Layout>
                }
                />
                <Route path='/:ecommerce?/payments_history/' element={
                  <Layout logo={false} >
                    <ProtectedRoute>
                      <PaymentsHistory />
                    </ProtectedRoute>
                  </Layout>
                }
                />
                <Route
                  path="/admin_panel/"
                  element={
                    <Layout>
                      <AdminPanel />
                    </Layout>
                  }
                />
                <Route
                  path="/:ecommerce?/change_user/"
                  element={
                    <Layout >
                      <ChangeUser />
                    </Layout>
                  }
                />
                <Route path='/:ecommerce?/change_ecommerce/' element={
                  <Layout >
                    <ChangeEcommerce />
                  </Layout>
                } />
                <Route path='/:ecommerce?/profile_picture/' element={
                  <Layout >
                    <ProfilePicture />
                  </Layout>
                } />
                <Route
                  path="/:ecommerce?/customize_store/"
                  element={
                    <Layout colors={colors} isCustomizeStore={true} change={change}>
                      <CustomizeStore setChange={setChange} change={change} setColorsForLayaut={setColors} />
                    </Layout>
                  }
                />
                <Route path='/:ecommerce?/maps/' element={
                  <Layout >
                    <Maps />
                  </Layout>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </DarkModeProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
