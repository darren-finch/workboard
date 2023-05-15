import NiceModal from "@ebay/nice-modal-react"
import { useState } from "react"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import { useScreenSize } from "./hooks/ScreenSize"
import BoardView from "./layouts/BoardView/BoardView"
import Dashboard from "./layouts/Dashboard"
import EditBoard from "./layouts/EditBoard"
import { boardRepository } from "./persistence"
import testBoard from "./persistence/seed"
import NotFound from "./layouts/NotFound"
import { v4 as uuid } from "uuid"

boardRepository.addBoard(testBoard)

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
							<Route path="/board/:boardId/edit" element={<EditBoard />} />
							<Route path="/board/add" element={<EditBoard />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</BrowserRouter>
			</NiceModal.Provider>
		</ScreenSizeContext.Provider>
	)
}

export default App
