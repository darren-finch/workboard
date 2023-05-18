import NiceModal, { NiceModalHocProps } from "@ebay/nice-modal-react"
import { useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { columnRepository } from "../../App"
import useFormFields from "../../hooks/FormFields"
import Column from "../../models/Column"
import ErrorDisplay from "../../components/misc/ErrorDisplay"

const EditColumnModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = NiceModal.useModal("edit-column-modal")
	const column: Column | undefined = modal.args?.column as Column
	const boardId: number = modal.args?.boardId as number
	const [error, setError] = useState<string>("")

	if (!boardId || isNaN(boardId) || boardId <= 0 || typeof boardId !== "number") {
		throw new Error("Bad board ID")
	}

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
		// Save or update the column
		if (isEditingExistingColumn) {
			const res = await columnRepository.updateColumn(
				new Column(column.id, fields.name.value, column.cards, column.boardId)
			)
			if (!res.success) {
				setError(res.message)
				return
			}
		} else {
			const res = await columnRepository.createColumn(new Column(0, fields.name.value, [], boardId))
			if (!res.success) {
				setError(res.message)
				return
			}
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
			<Modal.Footer className="d-flex align-items-center">
				{error && (
					<div className="w-25 flex-grow-1">
						<ErrorDisplay fontClass="fs-6" error={error} />
					</div>
				)}
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
