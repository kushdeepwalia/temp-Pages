import Header from "../Components/Header"
import Body from "../Components/Body"
import SideBar from "../Components/SideBar"
import ModelList from "./ModelList"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

const ModelsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || undefined;
  const id = location.state?.id || undefined;

  useEffect(() => {
    if (!name || !id) {
      navigate("/project")
    }
  }, [])

  console.log(id, name)

  return <>
    <Header />
    <div className='flex'>
      <SideBar activate="project" />
      <Body>
        <ModelList name={name} id={id} />
      </Body>
    </div>
  </>
}

export default ModelsPage