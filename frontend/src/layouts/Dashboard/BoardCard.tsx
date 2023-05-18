import NiceModal from "@ebay/nice-modal-react"
import { useNavigate } from "react-router-dom"
import { boardRepository } from "../../App"
import ContextButton from "../../components/ContextButton"

const BoardCard = ({ board }) => {
	const navigate = useNavigate()

	return (
		<div className={`card-card my-2 border border-secondary p-4 bg-dark rounded`}>
			<div className="d-flex align-items-top justify-content-between">
				<h3 className="mb-0">{board.name}</h3>
				<div className="d-flex align-items-center">
					<button
						className="icon-btn text-white bi bi-pencil-fill fs-6"
						onClick={() => navigate(`/boards/${board.id}`)}
					/>
					<button
						className="icon-btn text-white bi bi-trash-fill"
						onClick={() =>
							NiceModal.show("confirmation-modal", {
								body: "Are you sure you want to delete this board?",
							}).then(() => {
								boardRepository.deleteBoard(board.id)
							})
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default BoardCard
