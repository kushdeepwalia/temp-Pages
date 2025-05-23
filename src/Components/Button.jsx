const Button = (props) => {
  return <>
    <button id={props.id} className={'border-2 border-black hover:cursor-pointer flex items-center' + ' ' + (props.className ? props.className : "")} onClick={props.onClick}>{props.children}</button>
  </>
}

export default Button