import { useEffect, useState } from "react"
import BackButton from "../../components/misc/BackButton"
import ErrorDisplay from "../../components/misc/ErrorDisplay"
import { Button, Col, Container, Row } from "react-bootstrap"
import BoardList from "./BoardList"
import Hr from "../../components/misc/Hr"
import { boardRepository } from "../../App"
import Board from "../../models/Board"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
	const navigate = useNavigate()
	const [error, setError] = useState<string>("")
	const [boards, setBoards] = useState<Board[]>([])

	useEffect(() => {
		boardRepository.addBoardsListEventListener((boards) => {
			setBoards(boards)
		})
	}, [])

	return (
		<div className="bg-dark text-light" style={{ height: "calc(100% - 57px)" }}>
			{error && (
				<>
					<BackButton />
					<ErrorDisplay error={error} />
				</>
			)}
			{!error && (
				<>
					<Container className="p-4 h-100 border-start border-end border-secondary shadow d-flex flex-column">
						<h1>Dashboard</h1>
						<Hr />
						<div
							className="d-flex flex-column flex-grow-1 align-items-start"
							style={{ height: "calc(100% - 57px)" }}>
							{boards.length > 0 && (
								<>
									<div className="d-flex w-100 align-items-center justify-content-between">
										<h2 className="mt-4">Boards</h2>
										<Button variant="primary" onClick={() => navigate("/boards/add")}>
											Create Board
										</Button>
									</div>
									<BoardList boards={boards} />
								</>
							)}
							{boards.length === 0 && (
								<>
									<h2 className="mt-4">No Boards</h2>
									<p className="text-muted">Create a board to get started.</p>
									<Button variant="primary" onClick={() => navigate("/boards/add")}>
										Create Board
									</Button>
								</>
							)}
						</div>
					</Container>
				</>
			)}
		</div>
	)
}

export default Dashboard
