export default class Task {
	id: string
	name: string
	description: string
	tags: string[]
	columnId: string

	constructor(id: string, name: string, description: string, tags: string[], columnId: string) {
		this.id = id
		this.name = name
		this.description = description
		this.tags = tags
		this.columnId = columnId
	}
}
