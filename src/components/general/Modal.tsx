import { ModalProps } from "@/types/general";
import { AiOutlineClose } from "react-icons/ai";

const Modal = ({ header, dismiss, children }: ModalProps) => {
  return (
    <div
      className="fixed w-full h-screen flex items-center justify-center bg-gray-500 bg-opacity-20 transition-opacity p-2 rs:p-6 z-30"
      onClick={dismiss}
    >
      <div
        className="bg-white w-full max-w-xl h-auto max-h-[90vh] rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-5 px-6 h-fit w-full flex items-center justify-between border-b">
          <p className="font-medium text-lg">{header}</p>
          <button onClick={dismiss}>
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        <div className="w-full h-auto max-h-[calc(100vh-10rem)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
