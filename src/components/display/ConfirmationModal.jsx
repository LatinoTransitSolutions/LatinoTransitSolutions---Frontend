import Button from "../form/Button"
import Modal from "./Modal"

export default function ConfirmationModal({ open, width, height, loading, className, children, onCancel, onConfirm }) {
  return (
    <Modal width={width} height={height} open={open} className={className} hideCloseButton onClose={onCancel}>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-full shrink grow">{children}</div>
        <div className="w-full flex justify-between shrink-0 grow-0">
          <Button disabled={loading} onClick={onCancel} color="negative" type="outlined">
            Cancel
          </Button>
          <Button disabled={loading} onClick={onConfirm} color="positive">
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}