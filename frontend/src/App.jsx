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
import Product from './pages/Product';

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
                    <SellerDashboard />
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
            <Route path='/product/' element={
              <Layout>
                <ProtectedRoute>
                  <Product/>
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
