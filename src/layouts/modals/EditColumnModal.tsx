// This modal will be used to edit a task and it needs to be created using the NiceModal component from @ebay/nice-modal-react

import NiceModal, { NiceModalHocProps } from "@ebay/nice-modal-react"
import { useRef } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import useFormFields from "../../hooks/FormFields"
import Column from "../../models/Column"
import { columnRepository } from "../../persistence"

const EditColumnModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = NiceModal.useModal("edit-column-modal")
	const column: Column | undefined = modal.args?.column as Column
	const boardId: string = modal.args?.boardId as string

	const isEditingExistingColumn = column != null

	const [fields, wasValidated, handleFormInputChange, handleFormSubmitted] = useFormFields(
		{
			name: {
				name: "name",
				printName: "Name",
				value: column?.name ?? "",
				isValid: false,
			},
		},
		() => saveColumn()
	)

	const formRef = useRef<HTMLFormElement>(null)

	const handleHide = () => {
		modal.hide()
	}

	const handleExited = () => {
		modal.remove()
	}

	const saveColumn = async () => {
		// Save or update the task
		if (isEditingExistingColumn) {
			columnRepository.updateColumn(new Column(column.id, fields.name.value, column.tasks, column.boardId))
		} else {
			columnRepository.addColumn(new Column("", fields.name.value, [], boardId))
		}

		handleHide()
	}

	return (
		<Modal show={modal.visible} onHide={handleHide} onExited={handleExited} centered>
			<Modal.Header closeButton>
				<Modal.Title>{isEditingExistingColumn ? "Edit" : "Add"} Column</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form ref={formRef} onSubmit={(e) => handleFormSubmitted(e)} noValidate validated={wasValidated}>
					{Object.keys(fields).map((key) => {
						const field = fields[key as keyof typeof fields]
						return (
							<Form.Group key={field.name} controlId={field.name} className="my-2">
								<Form.Label>{field.printName}</Form.Label>
								<Form.Control
									type="text"
									placeholder={`Enter ${field.printName}`}
									value={field.value}
									onChange={handleFormInputChange}
									isInvalid={!field.isValid}
									required
								/>
								<Form.Control.Feedback type="invalid">
									{field.printName} is required
								</Form.Control.Feedback>
							</Form.Group>
						)
					})}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleHide}>
					Close
				</Button>
				<Button variant="primary" type="submit" onClick={() => formRef.current!.requestSubmit()}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	)
})

export default EditColumnModal
