import { Button, Container } from "react-bootstrap"
import BackButton from "./BackButton"
import { PropsWithChildren } from "react"

interface FullScreenErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
	error: string
	displayBackButton?: boolean
	errorFontSizeClass?: string
}

const FullScreenErrorDisplay: React.FC<PropsWithChildren<FullScreenErrorDisplayProps>> = ({
	error,
	displayBackButton,
	errorFontSizeClass,
	children,
}) => {
	return (
		<div className="bg-dark text-light w-100 flex-grow-1 p-2 d-flex flex-column align-items-center justify-content-center">
			<Container className="py-0 px-4 flex-grow-1 d-flex flex-column border-start border-end border-secondary shadow">
				{displayBackButton && (
					<div className="d-flex align-items-center">
						<BackButton text="Go Back" />
					</div>
				)}
				<div className="flex-grow-1 d-flex flex-column align-items-start justify-content-center">
					<h1 className={`${errorFontSizeClass ?? errorFontSizeClass} text-danger`}>{error}</h1>
					{children}
				</div>
			</Container>
		</div>
	)
}

export default FullScreenErrorDisplay
