interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // 바깥(overlay) 클릭하면 닫기
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()} // 안쪽(content) 클릭은 이벤트 막기
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;