import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const SideBar = (props) => {
  const navigate = useNavigate()
  const [tenantId, setTenantId] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    setTenantId(Number(user.tenant_id));
  }, []);

  return <>
    <div className="w-[200px] h-[calc(100vh_-_68px)] border-r-2 border-black flex flex-col items-center justify-between pt-6 pb-6">
      <div className="inline-flex flex-col gap-[16px] items-center w-[100%]">
        {
          tenantId === 1 ?
            <>
              <p onClick={() => navigate('/organization')} className={"hover:cursor-pointer " + (props.activate == "organization" ? "bg-amber-300" : "")}>Organization</p>
              <p onClick={() => navigate('/admin')} className={"hover:cursor-pointer " + (props.activate == "admin" ? "bg-amber-300" : "")}>Admin</p>
            </>
            :
            <>
            </>
        }
        <p onClick={() => navigate('/project')} className={"hover:cursor-pointer " + (props.activate == "project" ? "bg-amber-300" : "")}>Projects</p>
        {/* <p onClick={() => navigate('/model')} className={"hover:cursor-pointer " + (props.activate == "model" ? "bg-amber-300" : "")}>Model</p> */}
        {/* <p onClick={() => navigate('/logs')} className={ "hover:cursor-pointer " + (props.activate == "logs" ? "bg-amber-300" : "")}>Logs</p> */}
        {/* <IconButton to='/dashboard' active={props.activate == 'dashboard' ? true : false}/>
            <IconButton to='/roi' icon={roiIcon} active={props.activate == 'roi' ? true : false}/>
            <IconButton to='/' icon={emoteIcon}/>
            <IconButton to='/' icon={vizIcon}/>
            <IconButton to='/' icon={vizIcon}/>
            <IconButton to='/' icon={bridgeIcon}/>
            <IconButton to='/' icon={libraryIcon}/> */}
      </div>
    </div>
  </>
}

export default SideBar