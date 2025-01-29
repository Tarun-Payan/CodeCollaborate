import { useEffect } from "react";
import ReactDOM from "react-dom";

const OuterModal = ({ closeModal, children, isLoading }) => {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  const handleCloseModal = () => {
    if(!isLoading) closeModal();
  }

  return ReactDOM.createPortal(
    <>
      <div className="modal-wrapper fixed top-0 bottom-0 left-0 right-0 bg-[#bdbdbdd4]" onClick={handleCloseModal}></div>
      <div className="modal-container h-[500px] min-w-[400px] bg-white rounded-lg fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        {children}
        {/* {handleCloseButton} */}
      </div>
    </>,
    document.querySelector(".myPortalModalDiv")
  );
}

export default OuterModal
