interface ErrorDisplayProps {
	fontClass?: string
	error: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ fontClass, error }) => {
	return <p className={`${fontClass ?? "h4"} text-danger`}>{error}</p>
}

export default ErrorDisplay
