import { Outlet } from "react-router-dom"
import { FaHome } from "react-icons/fa";
import NavButton from "./NavButton"

const App = () => {
  return (
    <div className="text-white">
      <nav>
        <ul>
          <NavButton to="/" icon={<FaHome />} text="Home" />
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
