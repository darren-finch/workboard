import NiceModal from "@ebay/nice-modal-react"
import { Button, Modal } from "react-bootstrap"

const ConfirmationModal = NiceModal.create(() => {
	const modal = NiceModal.useModal("confirmation-modal")

	const title: string = modal.args?.title as string
	const body: string = modal.args?.body as string

	const handleHide = () => {
		modal.hide()
	}

	const handleExited = () => {
		modal.remove()
	}

	const handleConfirm = () => {
		modal.resolve()
		modal.hide()
	}

	return (
		// A confirmation modal with a title, body, and two buttons, one for confirming and one for cancelling, built with React Bootstrap.
		<Modal show={modal.visible} onHide={handleHide} onExited={handleExited} centered>
			<Modal.Header closeButton>
				<Modal.Title>{title ?? "Confirm"}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleHide}>
					No
				</Button>
				<Button variant="primary" onClick={handleConfirm}>
					Yes
				</Button>
			</Modal.Footer>
		</Modal>
	)
})

export default ConfirmationModal
