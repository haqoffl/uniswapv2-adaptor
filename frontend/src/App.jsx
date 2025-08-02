import './App.css'

import Layout from './Layout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Swap from './pages/Swap'
import Pool from './pages/Pool'
function App() {

  return (
    <>
    <BrowserRouter>
       <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Swap />} />
          <Route path='/pool' element={<Pool />} />
        </Route>
       </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
