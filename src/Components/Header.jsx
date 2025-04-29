import { useState } from 'react'
import iitLogo from '../assets/IITLogo.svg'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { queryClient } from '../utils/reactQuery';

const Header = () => {

  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()

  const toogleOptions = () => {
    const visibility = showOptions
    setShowOptions(!visibility)
  }

  const logOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    queryClient.removeQueries();
    navigate('/')
  }

  return <>
    <header className="bg-slate-400 h-[68px] flex items-center px-10 justify-between">
      <img src={iitLogo} />
      <div className='relative'>
        <FaUserCircle size={30} className='hover:cursor-pointer' onClick={() => toogleOptions()} />
        <div className={'absolute w-[150px] top-9 right-1 bg-white border-2 flex flex-col items-center ' + (showOptions ? "" : "hidden")}>
          {/* <div className='hover:cursor-pointer py-1 border-b-[1px] border-black w-full text-center'>Profile</div> */}
          {/* <hr className='w-full h-1' /> */}
          <div className='hover:cursor-pointer py-1 border-t-[1px] border-black w-full text-center' onClick={logOut}>Log out</div>
        </div>
      </div>
    </header>
  </>
}

export default Header