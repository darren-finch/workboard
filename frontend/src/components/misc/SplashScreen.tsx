import { Spinner } from "react-bootstrap"

const SplashScreen = () => {
	return (
		<div
			className="bg-dark d-flex flex-column justify-content-center align-items-center"
			style={{ height: "100vh" }}>
			<h1>WorkBoard</h1>
			<Spinner animation="border" variant="primary" />
		</div>
	)
}

export default SplashScreen
