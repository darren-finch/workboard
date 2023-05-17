import NiceModal from "@ebay/nice-modal-react"
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr"
import axios from "axios"
import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import { useScreenSize } from "./hooks/ScreenSize"
import BoardView from "./layouts/BoardView/BoardView"
import Dashboard from "./layouts/Dashboard"
import EditBoard from "./layouts/EditBoard"
import NotFound from "./layouts/NotFound"
import BoardRepository from "./persistence/BoardRepository"
import { ColumnRepository } from "./persistence/ColumnRepository"

const boardHubConnection = new HubConnectionBuilder()
	.withUrl(process.env.REACT_APP_SIGNALR_SERVER_URL + "/boardHub", {
		skipNegotiation: true,
		transport: HttpTransportType.WebSockets,
	})
	.build()

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_REST_API_SERVER_URL, timeout: 10000 })

const boardRepository = new BoardRepository(boardHubConnection, axiosInstance)
const columnRepository = new ColumnRepository(boardHubConnection)

const App = () => {
	const screenSize = useScreenSize()
	const [sidebarVisible, setSidebarVisible] = useState(false)

	useEffect(() => {
		boardHubConnection.start().catch((err) => console.error(err.toString()))
		boardRepository.init()
	}, [])

	return (
		<ScreenSizeContext.Provider value={screenSize}>
			<NiceModal.Provider>
				<BrowserRouter>
					<div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
						<Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
						<NavBar onSidebarToggle={() => setSidebarVisible(!sidebarVisible)} />
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/boards/:boardId" element={<BoardView />} />
							<Route path="/boards/:boardId/edit" element={<EditBoard />} />
							<Route path="/boards/add" element={<EditBoard />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
				</BrowserRouter>
			</NiceModal.Provider>
		</ScreenSizeContext.Provider>
	)
}

export { boardRepository, columnRepository }
export default App
