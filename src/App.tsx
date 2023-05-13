import { useState } from "react"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import BoardView from "./layouts/BoardView"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import { useScreenSize } from "./hooks/ScreenSize"
import NiceModal from "@ebay/nice-modal-react"
import { Offcanvas } from "react-bootstrap"

const App = () => {
	const screenSize = useScreenSize()
	const [sidebarVisible, setSidebarVisible] = useState(false)

	return (
		<ScreenSizeContext.Provider value={screenSize}>
			<NiceModal.Provider>
				<div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
					<Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
					<NavBar onSidebarToggle={() => setSidebarVisible(!sidebarVisible)} />
					<BoardView />
				</div>
			</NiceModal.Provider>
		</ScreenSizeContext.Provider>
	)
}

export default App
