import './App.css'
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';


function App() {
  return(<div className="Tolo">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Layout>
            <Home/>
          </Layout>
        }/>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
