import { useEffect, useState } from "react"
import { Button, Dropdown, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Board from "../models/Board"
import { boardRepository } from "../App"

interface NavBarProps {
	onSidebarToggle: () => void
}

const GlobalNavbar: React.FC<NavBarProps> = ({ onSidebarToggle }) => {
	const navigate = useNavigate()

	const [boards, setBoards] = useState<Board[]>([])

	useEffect(() => {
		boardRepository.addBoardsUpdatedListener((boards) => {
			setBoards(boards)
		})
	}, [])

	return (
		<Navbar
			bg="dark"
			expand="lg"
			variant="dark"
			className="p-2 align-items-center justify-content-between border-bottom border-secondary">
			<Navbar.Brand onClick={() => navigate("/")}>WorkBoard</Navbar.Brand>

			<div className="d-none d-md-flex align-items-center gap-2">
				{boards.length > 0 && (
					<Dropdown>
						<Dropdown.Toggle variant="dark">Boards</Dropdown.Toggle>

						<Dropdown.Menu variant="dark">
							{boards.map((board) => (
								<Dropdown.Item key={board.id} onClick={() => navigate(`/boards/${board.id}`)}>
									{board.name}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
				)}
				<Button variant="primary" onClick={() => navigate("/boards/add")}>
					Add Board
				</Button>
			</div>

			<div className="d-flex align-items-center">
				<button className="icon-btn text-white bi bi-person-fill" />
				<button className="icon-btn text-white bi bi-bell-fill" />
				<button className="icon-btn text-white bi bi-question-circle-fill" />
				<button
					className="navbar-toggler d-flex align-items-center justify-content-center gap-2"
					type="button"
					aria-controls="sidebarContent"
					aria-label="Toggle navigation"
					onClick={() => onSidebarToggle()}>
					<span className="navbar-toggler-icon"></span>
					<span className="d-none d-sm-inline fs-6">Menu</span>
				</button>
			</div>
		</Navbar>
	)
}

export default GlobalNavbar
