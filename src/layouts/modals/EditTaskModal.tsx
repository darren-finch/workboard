// This modal will be used to edit a task and it needs to be created using the NiceModal component from @ebay/nice-modal-react

import NiceModal, { NiceModalHocProps } from "@ebay/nice-modal-react"
import { useState } from "react"
import { Button, CloseButton, Form, InputGroup, Modal } from "react-bootstrap"
import { useTags } from "../../hooks/Tags"

const EditTaskModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = NiceModal.useModal(EditTaskModal)

	const [currentTag, setCurrentTag] = useState<string>("")
	const [tags, addTag, removeTag, clearTags] = useTags([])

	const handleHide = () => {
		modal.hide()
	}

	const handleExited = () => {
		setCurrentTag("")
		clearTags()
		modal.remove()
	}

	const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
		console.log("Submitted")
		e?.preventDefault()
		e?.stopPropagation()
		// Save task
	}

	const handleCurrentTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentTag(e.target.value)
	}

	const addTagWrapper = () => {
		addTag(currentTag)
		setCurrentTag("")
	}

	return (
		<Modal show={modal.visible} onHide={handleHide} onExited={handleExited} centered>
			<Modal.Header closeButton>
				<Modal.Title>Edit Task</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={(e) => handleSubmit(e)}>
					<Form.Group controlId="title">
						<Form.Label>Title</Form.Label>
						<Form.Control type="text" placeholder="Enter title" />
					</Form.Group>

					<Form.Group controlId="description" className="mt-2">
						<Form.Label>Description</Form.Label>
						<Form.Control type="text" placeholder="Enter description" />
					</Form.Group>

					<Form.Group controlId="tags" className="mt-2">
						<Form.Label>Tags</Form.Label>
						<div className="d-flex flex-wrap gap-2">
							{tags.map((tag) => (
								<Button
									key={tag}
									variant="outline-primary"
									size="sm"
									className="mb-2"
									onClick={() => removeTag(tag)}>
									{tag} <span>&times;</span>
								</Button>
							))}
						</div>
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="Add tag"
								onChange={handleCurrentTagChange}
								onKeyDown={(e) => {
									if (e.key === "Enter") addTagWrapper()
								}}
								value={currentTag}
							/>
							<Button variant="outline-secondary" onClick={() => addTagWrapper()}>
								<i className="bi bi-arrow-return-left"></i>
							</Button>
						</InputGroup>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleHide}>
					Close
				</Button>
				<Button variant="primary" type="submit" onClick={(e) => handleSubmit(undefined)}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	)
})

export default EditTaskModal
