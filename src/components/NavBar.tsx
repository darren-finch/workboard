import { useState } from "react"
import { Navbar, Nav, Dropdown } from "react-bootstrap"

interface NavBarProps {
	onSidebarToggle: () => void
}

const GlobalNavbar: React.FC<NavBarProps> = ({ onSidebarToggle }) => {
	const [boardDropdownVisible, setBoardDropdownVisible] = useState(false)

	return (
		<Navbar
			bg="dark"
			expand="lg"
			variant="dark"
			className="p-2 align-items-center justify-content-between border-bottom border-secondary">
			<Navbar.Brand>WorkBoard</Navbar.Brand>

			<div className="d-none d-md-flex align-items-center">
				<Dropdown>
					<Dropdown.Toggle variant="dark">Boards</Dropdown.Toggle>

					<Dropdown.Menu variant="dark">
						<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
						<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
						<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
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
