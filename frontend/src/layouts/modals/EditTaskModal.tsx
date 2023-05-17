// This modal will be used to edit a task and it needs to be created using the NiceModal component from @ebay/nice-modal-react

import NiceModal, { NiceModalHocProps } from "@ebay/nice-modal-react"
import { useRef, useState } from "react"
import { Button, Form, InputGroup, Modal } from "react-bootstrap"
import { useTags } from "../../hooks/Tags"
import Task from "../../models/Task"
import useFormFields from "../../hooks/FormFields"
import { taskRepository } from "../../App"
import ErrorDisplay from "../../components/misc/ErrorDisplay"

const EditTaskModal = NiceModal.create<NiceModalHocProps>(() => {
	const modal = NiceModal.useModal("edit-task-modal")
	const task: Task | undefined = modal.args?.task as Task
	const columnId: number = modal.args?.columnId as number

	if (!columnId || isNaN(columnId) || columnId <= 0 || typeof columnId !== "number") {
		throw new Error("Bad column ID")
	}

	const isEditingExistingTask = task != null

	const [currentTag, setCurrentTag] = useState<string>("")
	const [tags, addTag, removeTag, clearTags] = useTags(task?.tags ?? [])
	const [fields, wasValidated, handleFormInputChange, handleFormSubmitted] = useFormFields(
		{
			name: {
				name: "name",
				printName: "Name",
				value: task?.name ?? "",
				isValid: false,
			},
			description: {
				name: "description",
				printName: "Description",
				value: task?.description ?? "",
				isValid: false,
			},
		},
		() => saveTask()
	)

	const [error, setError] = useState<string>("")

	const formRef = useRef<HTMLFormElement>(null)

	const handleHide = () => {
		modal.hide()
	}

	const handleExited = () => {
		setCurrentTag("")
		clearTags()
		modal.remove()
	}

	const handleCurrentTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentTag(e.target.value)
	}

	const addTagWrapper = () => {
		addTag(currentTag)
		setCurrentTag("")
	}

	const saveTask = async () => {
		// Save or update the task
		if (isEditingExistingTask) {
			const res = await taskRepository.updateTask(
				new Task(task!.id, fields.name.value, fields.description.value, tags, columnId)
			)
			if (!res.success) {
				setError(res.message)
				return
			}
		} else {
			const res = await taskRepository.createTask(
				new Task(0, fields.name.value, fields.description.value, tags, columnId)
			)
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
				<Modal.Title>{isEditingExistingTask ? "Edit" : "Add"} Task</Modal.Title>
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

export default EditTaskModal
