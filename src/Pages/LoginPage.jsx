import { useNavigate } from 'react-router-dom'

import Body from "../Components/Body"
import Button from "../Components/Button"

import iitLogo from '../assets/IITLogo.svg'
import { IoMdClose } from "react-icons/io";
import { useCallback, useEffect, useState } from 'react'
import api from '../api'
import { fetchAndCacheTenantData } from '../utils/fetchAndCacheTenantData'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPassword, setModalPassword] = useState("");
  const [modalPasswordError, setModalPasswordError] = useState(false);
  const [modalConfirmPassword, setModalConfirmPassword] = useState("");
  const [modalConfirmPasswordError, setModalConfirmPasswordError] = useState(false);

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
    if (email !== "kushdeepwalia.iit@gmail.com") {
      if (password) {
        setPasswordError(validatePassword(password));
      }
    }
  }, [password])

  const navigate = useNavigate();

  const loginBtnClick = async () => {
    if (email !== "kushdeepwalia.iit@gmail.com") {
      if (validateEmail(email) || validatePassword(password)) {
        return alert("Error");
      }
    }
    api.post("/auth/login", { method: "credentials", email, pass: password }).then(async (res) => {
      if (res.status === 200) {
        const { data } = res;
        const { user, token } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Prefetch everything
        await fetchAndCacheTenantData(user.tenant_id);

        if (Number(user.tenant_id) === 1)
          navigate('/organization')
        else
          navigate('/project')
      }
      else
        alert("Error")
    })
      .catch(({ response: error }) => {
        console.log(error)
        alert(error.statusText)
      })
  }

  const handleSetPassword = () => {
    setModalPasswordError(false)
    setModalConfirmPasswordError(false)
    if (validateModalPassword(modalPassword) && validateModalPassword(modalConfirmPassword)) {
      if (modalConfirmPassword === modalPassword) {

        api.put("/auth/modifypass", { pass: modalPassword })
          .then((res) => {
            const { data } = res;
            const { user, token } = data;
            const tenantId = localStorage.getItem("tenantId")
            console.log(tenantId, typeof tenantId);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (Number(tenantId) === 1) {
              redirectIfRequire("/organization")
            } else {
              redirectIfRequire("/project")
            }
            setIsModalOpen(false)
          })
          .catch((error) => {
            console.log(error);
          })

      } else {
        setModalConfirmPasswordError(true);
      }
    } else {
      setModalPasswordError(true);
    }
  }

  const validateModalPassword = (word) => {
    if (word === "") return false;
    return true
  }


  const redirectIfRequire = useCallback(async (page) => {
    // Prefetch everything
    await fetchAndCacheTenantData();
    navigate(page)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('auth');
    const tenant_id = urlParams.get('tenant');
    // console.log(urlParams, token)

    if (token) {
      console.log("setting");
      console.log(tenant_id, typeof tenant_id);
      localStorage.setItem('token', token);
      localStorage.setItem('tenantId', tenant_id);
      //   redirectIfRequire(tenant_id)
      setIsModalOpen(true)
    }
  }, [])

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
            {emailError && <span className='text-sm pl-1 text-red-400'>Error in email*</span>}
          </div>
          <div className='flex flex-col'>
            <input id="input-password" name="input-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-black border-[2px]" />
            {passwordError && <span className='text-sm pl-1 text-red-400'>Error in password*</span>}
          </div>
        </div>
        <Button onClick={loginBtnClick}>Login</Button>
      </div>
    </Body>
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[400px] relative">
          <button className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
            onClick={() => setIsModalOpen(false)}>
            <IoMdClose size={24} />
          </button>

          <h2 className="text-xl font-bold mb-4">Set Password</h2>

          <label className="block mb-2">Enter Password</label>
          <input className="border w-full p-2 mb-4"
            value={modalPassword}
            onChange={(e) => {
              setModalPassword(e.target.value)
              setModalPasswordError(false)
            }}
          />
          {modalPasswordError ? <label className="block mb-2 text-red-400">Error: Enter a valid password</label> : <></>}

          <label className="block mb-2">Confirm Password</label>
          <input className="border w-full p-2 mb-4"
            value={modalConfirmPassword}
            onChange={(e) => {
              setModalConfirmPassword(e.target.value)
              setModalConfirmPasswordError(false)
            }}
          />
          {modalConfirmPasswordError ? <label className="block mb-2 text-red-400">Error: Incorrect password</label> : <></>}


          <div className='flex w-[100%] justify-end gap-4'>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer" onClick={() => { handleSetPassword() }}>
              Set Password
            </button>
          </div>
        </div>
      </div>
    )}
  </>
}

export default LoginPage