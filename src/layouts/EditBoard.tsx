import { Button, CloseButton, Container, Form } from "react-bootstrap"
import Board from "../models/Board"
import { useEffect, useRef, useState } from "react"
import { boardRepository } from "../persistence"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import ErrorDisplay from "../components/misc/ErrorDisplay"
import BackButton from "../components/misc/BackButton"
import useFormFields from "../hooks/FormFields"

const EditBoard = () => {
	const navigate = useNavigate()

	const { boardId } = useParams()
	const isEditingExistingBoard = !!boardId

	const [board, setBoard] = useState<Board>(new Board("", "", []))
	const [error, setError] = useState<string>("")

	const [fields, wasValidated, handleFormInputChange, handleFormSubmitted] = useFormFields(
		{
			name: {
				name: "name",
				printName: "Name",
				value: board?.name ?? "",
				isValid: false,
			},
		},
		() => saveBoard()
	)

	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!isEditingExistingBoard) return

		boardRepository.getBoard(boardId).then((result) => {
			if (!result.success) {
				setError(result.message)
				return
			}

			setBoard(result.value!)
		})
	}, [])

	const saveBoard = async () => {
		// Save or update the task
		if (isEditingExistingBoard) {
			await boardRepository.updateBoard(new Board(board.id, fields.name.value, board.columns))
			navigate("/board/" + board.id)
		} else {
			const result = await boardRepository.addBoard(new Board("", fields.name.value, []))
			if (!result.success) {
				setError(result.message)
				return
			}
			navigate("/board/" + result.value)
		}
	}

	return (
		<div className="bg-dark text-light flex-grow-1">
			{error && (
				<>
					<BackButton />
					<ErrorDisplay error={error} />
				</>
			)}
			{!error && (
				<>
					<Container className="p-0 h-100 border-start border-end border-secondary p-4 shadow">
						<div className="d-flex align-items-center gap-2">
							<BackButton />
							<h1>{isEditingExistingBoard ? "Edit " + board.name : "Add Board"}</h1>
							<Button
								className="ms-auto"
								variant="primary"
								type="submit"
								onClick={() => formRef.current!.requestSubmit()}>
								Save
							</Button>
						</div>
						<Form
							// className="border border-secondary rounded p-4 shadow"
							ref={formRef}
							onSubmit={(e) => handleFormSubmitted(e)}
							noValidate
							validated={wasValidated}>
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
											style={{ maxWidth: "250px" }}
										/>
										<Form.Control.Feedback type="invalid">
											{field.printName} is required
										</Form.Control.Feedback>
									</Form.Group>
								)
							})}
							<Button variant="primary" type="submit">
								Save
							</Button>
						</Form>
					</Container>
				</>
			)}
		</div>
	)
}

export default EditBoard
