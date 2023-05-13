import Task from "./Task"

export default class Column {
	id: string
	name: string
	tasks: Task[]
	boardId: string

	constructor(id: string, name: string, tasks: Task[], boardId: string) {
		this.id = id
		this.name = name
		this.tasks = tasks
		this.boardId = boardId
	}
}
