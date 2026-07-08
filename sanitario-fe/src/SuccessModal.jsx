export default function SuccessModal({ title = 'Operazione completata', message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <div className="success-icon">✓</div>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

