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

function App() {
  return (
    <div className="Tolo">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
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
<<<<<<< HEAD
                    <SellerDashboard />
=======
                  {/* <ProtectedRoute> */}
                    <SellerDashboard />
                  {/* </ProtectedRoute> */}
>>>>>>> 0eaa37719ea4e77a5528be2515a97cf6ff36710c
                </Layout>
              }
            />
            <Route path='/ecommerce_dashboard/' element={
                <Layout>
                  <ProtectedRoute>
                    <EcommerceDashboard />
                  </ProtectedRoute>
                </Layout>
            }/>
            <Route path='/create_product/' element={
              <Layout>
                <ProtectedRoute>
                  <CreateProduct/>
                </ProtectedRoute>
              </Layout>
            }/>
            <Route path='/product_crud/' element={
              <Layout>
                <ProtectedRoute>
                  <ProductCRUD/>
                </ProtectedRoute>
              </Layout>
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
