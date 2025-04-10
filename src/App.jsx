import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import DetailView from "./pages/DetailView"

import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  // note that index nested route is what's rendered when there's nothing after url path
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Dashboard />} />
          <Route index={false} path="/artistInfo/:id" element={<DetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
