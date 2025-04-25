import { useNavigate } from 'react-router-dom'

import Body from "../Components/Body"
import Button from "../Components/Button"

import iitLogo from '../assets/IITLogo.svg'
import { useEffect, useState } from 'react'
import api from '../api'
import { fetchAndCacheTenantData } from '../utils/fetchAndCacheTenantData'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,20}$/;
    return !passwordRegex.test(password);
  };

  useEffect(() => {
    if (email) {
      setEmailError(validateEmail(email));
    }
  }, [email])

  useEffect(() => {
    if (password) {
      setPasswordError(validatePassword(password));
    }
  }, [password])

  const navigate = useNavigate();

  const loginBtnClick = async () => {
    if (validateEmail(email) || validatePassword(password)) {
      alert("Error");
    }
    const res = await api.post("/auth/login", { method: "credentials", email, pass: password });
    if (res.status === 200) {
      const { data } = res;
      const { token } = data;
      localStorage.setItem('token', token);

      // Prefetch everything
      await fetchAndCacheTenantData();

      navigate('/organization')
    }
    else
      alert("Error")
  }

  return <>
    <header className=" h-[68px] flex justify-end items-center pr-[16px]">
      <img src={iitLogo} />
    </header>
    <Body>
      <div className='flex flex-col items-center'>
        <div>
          <h1>Login</h1>
        </div>
        <div className="flex flex-col gap-[16px] m-[16px]">
          <div className='flex flex-col'>
            <input id="input-email" name="input-email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-black border-[2px]" />
            {emailError && <span className='text-sm pl-1 text-red-400'>Error in email *</span>}
          </div>
          <div className='flex flex-col'>
            <input id="input-password" name="input-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-black border-[2px]" />
            {passwordError && <span className='text-sm pl-1 text-red-400'>Error in password * {password}</span>}
          </div>
        </div>
        <Button onClick={loginBtnClick}>Login</Button>
      </div>
    </Body>
  </>
}

export default LoginPage