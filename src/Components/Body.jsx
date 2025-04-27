const Body = (props) => {
    return <>
    <div className='flex-col justify-items-center content-center h-[calc(100vh_-_68px)] w-[calc(100%_-_200px)]'>
        {props.children}
    </div>
    </>
}

export default Body