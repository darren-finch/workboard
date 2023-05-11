import Hr from "./misc/Hr"

interface SidebarProps {
	visible: boolean
	onHide: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onHide }) => {
	return (
		<div
			className={`sidebar${
				visible ? " sidebar--open " : " "
			}position-absolute top-0 bottom-0 bg-dark text-white d-flex flex-column p-2 border-start border-secondary`}
			style={{ width: "250px", zIndex: "1" }}>
			<div className="d-flex w-100 align-items-center">
				<h1>Sidebar</h1>
				<button className="btn-close text-white ms-auto" onClick={() => onHide()} />
			</div>
			<Hr />
			<div className="d-flex flex-column flex-grow-1 gap-2">
				<button className="btn btn-outline-light w-100">Button 1</button>
				<button className="btn btn-outline-light w-100">Button 2</button>
				<button className="btn btn-outline-light w-100">Button 3</button>
			</div>
		</div>
	)
}

export default Sidebar
