import { useEffect, useState } from "react"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import BoardView from "./layouts/BoardView/BoardView"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import { useScreenSize } from "./hooks/ScreenSize"
import NiceModal from "@ebay/nice-modal-react"
import { Offcanvas } from "react-bootstrap"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./layouts/Dashboard"
import { boardRepository } from "./persistence"
import testBoard from "./persistence/seed"

boardRepository.createBoard(testBoard)

const App = () => {
	const screenSize = useScreenSize()
	const [sidebarVisible, setSidebarVisible] = useState(false)

	return (
		<ScreenSizeContext.Provider value={screenSize}>
			<NiceModal.Provider>
				<BrowserRouter>
					<div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
						<Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
						<NavBar onSidebarToggle={() => setSidebarVisible(!sidebarVisible)} />
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/board/:boardId" element={<BoardView />} />
							<Route path="*" element={<h1>404 Not Found</h1>} />
						</Routes>
					</div>
				</BrowserRouter>
			</NiceModal.Provider>
		</ScreenSizeContext.Provider>
	)
}

export default App
