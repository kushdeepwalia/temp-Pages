import Header from "../Components/Header"
import Body from "../Components/Body"
import SideBar from "../Components/SideBar"
import ModelList from "./ModelList"

const ModelsPage = () => {
    return <>
    <Header />
    <div className='flex'>
        <SideBar activate="model"/>
        <Body>
            <ModelList />
        </Body>
    </div>
    </>
}

export default ModelsPage