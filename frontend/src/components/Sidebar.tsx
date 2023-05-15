import { Offcanvas } from "react-bootstrap"
import Hr from "./misc/Hr"

interface SidebarProps {
	visible: boolean
	onHide: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onHide }) => {
	return (
		<Offcanvas show={visible} onHide={onHide}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Offcanvas</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images,
				lists, etc.
			</Offcanvas.Body>
		</Offcanvas>
	)
}

export default Sidebar
