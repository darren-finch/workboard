import NiceModal from "@ebay/nice-modal-react"
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr"
import axios from "axios"
import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import BoardView from "./layouts/BoardView/BoardView"
import EditBoard from "./layouts/EditBoard"
import NotFound from "./layouts/NotFound"
import BoardRepository from "./persistence/BoardRepository"
import { ColumnRepository } from "./persistence/ColumnRepository"
import { CardRepository } from "./persistence/CardRepository"
import FullScreenErrorDisplay from "./components/misc/FullScreenErrorDisplay"
import { Button } from "react-bootstrap"
import SplashScreen from "./components/misc/SplashScreen"
import Dashboard from "./layouts/Dashboard/Dashboard"

const boardHubConnection = new HubConnectionBuilder()
	.withUrl(process.env.REACT_APP_SIGNALR_SERVER_URL + "/boardHub", {
		skipNegotiation: true,
		transport: HttpTransportType.WebSockets,
	})
	.build()

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_REST_API_SERVER_URL, timeout: 10000 })

const boardRepository = new BoardRepository(boardHubConnection, axiosInstance)
const columnRepository = new ColumnRepository(boardHubConnection)
const cardRepository = new CardRepository(boardHubConnection)

enum AppState {
	Loading,
	Loaded,
	Error,
}

const App = () => {
	const [screenSize, setScreenSize] = useState<number>(window.innerWidth)

	useEffect(() => {
		return window.addEventListener("resize", () => setScreenSize(window.innerWidth))
	}, [])

	const [sidebarVisible, setSidebarVisible] = useState(false)

	const [error, setError] = useState<string>("")
	const [appState, setAppState] = useState<AppState>(AppState.Loading)

	useEffect(() => {
		boardHubConnection
			.start()
			.then(() => {
				console.log("Connected to SignalR server")
				boardRepository.init()
				boardHubConnection.onclose(() => {
					setError("Connection to server lost. Please refresh the page to reconnect.")
					setAppState(AppState.Error)
				})
				setAppState(AppState.Loaded)
			})
			.catch((err) => {
				setError(err.message)
				setAppState(AppState.Error)
			})
	}, [])

	return (
		<>
			<div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
				{appState == AppState.Loading && <SplashScreen />}
				{appState == AppState.Error && (
					<FullScreenErrorDisplay error={error} displayBackButton={false} errorFontSizeClass="h4">
						<Button variant="primary" onClick={() => window.location.reload()}>
							Reload
						</Button>
					</FullScreenErrorDisplay>
				)}
				{appState == AppState.Loaded && (
					<ScreenSizeContext.Provider value={screenSize}>
						<NiceModal.Provider>
							<BrowserRouter>
								<Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
								<NavBar onSidebarToggle={() => setSidebarVisible(!sidebarVisible)} />
								<Routes>
									<Route path="/" element={<Dashboard />} />
									<Route path="/boards/:boardId" element={<BoardView />} />
									<Route path="/boards/:boardId/edit" element={<EditBoard />} />
									<Route path="/boards/add" element={<EditBoard />} />
									<Route path="*" element={<NotFound />} />
								</Routes>
							</BrowserRouter>
						</NiceModal.Provider>
					</ScreenSizeContext.Provider>
				)}
			</div>
		</>
	)
}

export { boardRepository, columnRepository, cardRepository }
export default App
