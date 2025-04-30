import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const DeleteConfirmationModal = (props) => {

    // deleteFunction
    const [inputConfirmWord, setinputConfirmWord] = useState("");
    const [inputConfirm, setInputConfirm] = useState("");

    const close = () => {
        setInputConfirm("");
        setinputConfirmWord("");
        props.closeModal();
    }

    return <>
        {props.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] relative">

                <button className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
                    onClick={() => close()}>
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>

                <label className="block mb-2">Enter "{props.itemData.itemName}" to Confirm</label>
                <input
                    className="border w-full p-2 mb-4"
                    value={inputConfirmWord}
                    onChange={(e) => setinputConfirmWord(e.target.value)}
                />
                
                <label className="block mb-2">Enter "delete" to Confirm</label>
                <input
                    className="border w-full p-2 mb-4"
                    value={inputConfirm}
                    onChange={(e) => setInputConfirm(e.target.value)}
                />

                <div className="flex justify-between gap-4">
                    <button className={(inputConfirm === "delete" && inputConfirmWord === props.itemData.itemName) ? "bg-red-400 text-white px-4 py-2 rounded hover:cursor-pointer" : "bg-gray-300 px-4 py-2 rounded"}
                        disabled={!(inputConfirm === "delete" && inputConfirmWord === props.itemData.itemName)}
                        onClick={ () => {
                            props.deleteItem(props.itemData.itemId);
                            close();
                        }
                    }>
                        Delete
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded hover:cursor-pointer" onClick={() => {close()}}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        )}
    </>
}

export default DeleteConfirmationModal;