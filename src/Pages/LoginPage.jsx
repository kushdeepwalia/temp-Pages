import { useNavigate } from 'react-router-dom'

import Body from "../Components/Body"
import Button from "../Components/Button"
// eslint-ignore-next-line
import Header from "../Components/Header"

import iitLogo from '../assets/IITLogo.svg'

const LoginPage = () => {

    const navigate = useNavigate()
    const loginBtnClick = () => {
        navigate('/organization')
    }

    return <>
    <header className=" h-[68px] flex justify-end items-center pr-[16px]">
        <img src={iitLogo}/>
    </header>
    <Body>
        <div className='flex flex-col items-center'>
            <div>
                <h1>Login</h1>
            </div>
            <div className="flex flex-col gap-[16px] m-[16px]">
                <input id="input-email" name="input-email" type="text" placeholder="Email" className="border-black border-[2px]"/>
                <input id="input-password" name="input-password" type="password" placeholder="Password" className="border-black border-[2px]"/>
            </div>
            <Button onClick={() => {
                // Any other function to be called
                loginBtnClick()
            }}>Login</Button>
        </div>
    </Body>
    </>
}

export default LoginPage