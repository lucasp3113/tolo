import './App.css'
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return(<div className="Tolo">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Layout>
            <Home/>
          </Layout>
        }/>
        <Route path='/login/' element={
          <Layout>
            <Login/>
          </Layout>
        }/>
        <Route path='/register/' element={
          <Layout>
            <Register/>
          </Layout>
        }/>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
