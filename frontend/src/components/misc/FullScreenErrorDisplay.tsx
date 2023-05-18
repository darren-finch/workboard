import { Button, Container } from "react-bootstrap"
import BackButton from "./BackButton"
import { PropsWithChildren } from "react"

interface FullScreenErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
	error: string
	displayBackButton?: boolean
}

const FullScreenErrorDisplay: React.FC<PropsWithChildren<FullScreenErrorDisplayProps>> = ({ error, children }) => {
	return (
		<Container>
			<div className="d-flex align-items-center">
				<BackButton text="Go Back" />
			</div>
			<div className="flex-grow-1">
				<h2 className="text-danger">{error}</h2>
				{children}
			</div>
		</Container>
	)
}

export default FullScreenErrorDisplay
