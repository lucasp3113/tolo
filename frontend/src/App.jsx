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

function App() {
  /*esto es para conectar la peticion q hace el formualrio de busqueda en el
    componente HeaderNav con la page Home, para renderizar los productos
  */
  const [searchData, setSearchData] = useState(null)

  return (
    <div className="Tolo">
      <DarkModeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout search={true} setSearchData={setSearchData}>
                    <Home searchData={searchData} />
                  </Layout>
                }
              />
              <Route
                path="/login/"
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />
              <Route
                path="/register/"
                element={
                  <Layout>
                    <Register />
                  </Layout>
                }
              />
              <Route
                path="/seller_dashboard/"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <SellerDashboard />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route path='/ecommerce_dashboard/' element={
                <Layout>
                  <ProtectedRoute>
                    <EcommerceDashboard />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path='/create_product/' element={
                <Layout>
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path='/product_crud/' element={
                <Layout>
                  <ProtectedRoute>
                    <ProductCRUD />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path='/settings/' element={
                <Layout>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path='/change_password' element={
                <Layout>
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                </Layout>
              }>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </DarkModeProvider>
    </div>
  );
}

export default App;
