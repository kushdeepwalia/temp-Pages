import { useState } from 'react'
import iitLogo from '../assets/IITLogo.svg'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const [showOptions, setShowOptions] = useState(false)
    const navigate = useNavigate()

    const toogleOptions = () => {
        const visibility = showOptions
        setShowOptions(!visibility)
    }

    const logOut = () => {
        navigate('/')
    }

    return <>
    <header className="bg-slate-400 h-[68px] flex justify-between">
        <img src={iitLogo}/>
        <div className='relative'>
            <img src={iitLogo} className='hover:cursor-pointer' onClick={() => toogleOptions()}/>
            <div className={'absolute w-[150px] right-[20px] bg-white border-2 flex flex-col items-center ' + (showOptions ? "" : "hidden")}>
                <div className='hover:cursor-pointer'>Profile</div>
                <div className='hover:cursor-pointer' onClick={logOut}>Log out</div>
            </div>
        </div>
    </header>
    </>
}

export default Header