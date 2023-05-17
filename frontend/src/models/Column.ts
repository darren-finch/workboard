import Task from "./Task"

export default class Column {
	id: number
	name: string
	tasks: Task[]
	boardId: number

	constructor(id: number, name: string, tasks: Task[], boardId: number) {
		this.id = id
		this.name = name
		this.tasks = tasks
		this.boardId = boardId
	}
}
