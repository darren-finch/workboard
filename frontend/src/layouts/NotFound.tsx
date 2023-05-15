import { Container } from "react-bootstrap"
import BackButton from "../components/misc/BackButton"

const NotFound = () => {
	return (
		<div className="bg-dark text-light flex-grow-1 p-2">
			<Container>
				<div className="d-flex align-items-center">
					<BackButton text="Go Back" />
				</div>
				<div className="flex-grow-1">
					<h1 className="display-1">404</h1>
					<h2 className="display-6">Page not found</h2>
				</div>
			</Container>
		</div>
	)
}

export default NotFound
