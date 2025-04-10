import { Link } from "react-router-dom"

const NavButton = ({ to, icon, text }) => {
  return (
    <li >
      <Link to={to} className="flex items-center justify-center font-bold p-4">
        <span className="text-3xl mr-4 mb-1">
          {icon}
        </span>
        {text}
      </Link>
    </li>
  )
}

export default NavButton
