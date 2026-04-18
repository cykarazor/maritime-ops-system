import Modal from "./Modal";

export default function ModalForm({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      }
    >
      {children}
    </Modal>
  );
}