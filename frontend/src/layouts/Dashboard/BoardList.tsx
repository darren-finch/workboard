import BoardCard from "./BoardCard"

const BoardList = ({ boards }) => {
	return (
		<div className="w-100 flex-grow-1 overflow-scroll hide-scrollbar-container">
			{boards.map((board) => {
				return <BoardCard board={board} key={board.id} />
			})}
		</div>
	)
}

export default BoardList
