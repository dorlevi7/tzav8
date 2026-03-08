import { useState } from "react";

function Modal({ title, children, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 250); // must match CSS animation time
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal ${isClosing ? "closing" : ""}`}>
        <div className="modal-header">
          <h2>{title}</h2>

          <button className="modal-close" onClick={closeModal}>
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
