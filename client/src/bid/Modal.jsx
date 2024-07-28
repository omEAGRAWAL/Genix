/* eslint-disable react/prop-types */
import { GiCancel } from "react-icons/gi";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <button
          onClick={onClose}
          className="absolute m-1  top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <GiCancel />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
