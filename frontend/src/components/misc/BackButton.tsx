import { useNavigate } from "react-router-dom"

interface BackButtonProps {
	text?: string
	fontSizeClass?: string
	onClick?: () => void
}

const BackButton: React.FC<BackButtonProps> = ({ text, fontSizeClass, onClick }) => {
	const navigate = useNavigate()

	return (
		<button
			className={`icon-btn text-white ${fontSizeClass ?? "fs-4"} d-flex gap-2`}
			onClick={onClick ?? (() => navigate(-1))}>
			<i className={`bi bi-arrow-left`}></i>
			<span>{text}</span>
		</button>
	)
}

export default BackButton
