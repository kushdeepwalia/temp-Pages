import Header from "../Components/Header"
import Body from "../Components/Body"
import SideBar from "../Components/SideBar"
import ModelList from "./ModelList"
import { useLocation } from "react-router-dom"

const ModelsPage = () => {
  const location = useLocation();
  const { name, id } = location.state;
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