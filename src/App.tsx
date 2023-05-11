import { useState } from "react"
import NavBar from "./components/NavBar"
import Sidebar from "./components/Sidebar"
import BoardView from "./layouts/BoardView"
import { ScreenSizeContext } from "./context/ScreenSizeContext"
import { useScreenSize } from "./hooks/ScreenSize"

const App = () => {
	const screenSize = useScreenSize()
	const [sidebarVisible, setSidebarVisible] = useState(false)

	return (
		<ScreenSizeContext.Provider value={screenSize}>
			<div className="d-flex flex-column" style={{ height: "100vh" }}>
				<Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />
				<NavBar onSidebarToggle={() => setSidebarVisible(!sidebarVisible)} />
				<BoardView />
			</div>
		</ScreenSizeContext.Provider>
	)
}

export default App
