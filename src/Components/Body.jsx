const Body = (props) => {
    return <>
    <div className='flex-col justify-items-center content-center h-[calc(100vh_-_68px)] w-[100%] overflow-y-auto'>
        {props.children}
    </div>
    </>
}

export default Body