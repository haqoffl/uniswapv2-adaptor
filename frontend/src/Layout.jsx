import adaptor from  "./assets/adaptor.svg"
import {Link, Outlet} from "react-router-dom"
const Layout = () =>{
    return (
<>
<div className="sticky top-0 z-20 w-full px-4 bg-white/80 backdrop-blur-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between border border-gray-200 shadow-sm rounded-2xl py-3 px-6">

    {/* Left: Navigation */}
    <ul className="flex items-center gap-x-8 text-sm font-medium text-gray-700">
      <li className="flex items-center gap-2 text-blue-600 transition cursor-pointer">
        <img src={adaptor} alt="logo" className="w-8 h-8" />
        <span>V2 Adaptor</span>
      </li>
      <li className="hover:text-blue-600 transition cursor-pointer"><Link to={"/"}>Swap</Link></li>
      <li className="hover:text-blue-600 transition cursor-pointer"><Link to={"/pool"}>Pool</Link></li>
    </ul>

    {/* Right: Wallet Button */}
    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full transition duration-200">
      Connect Wallet
    </button>
  </div>
</div>

<Outlet />
</>


    )
}

export default Layout;