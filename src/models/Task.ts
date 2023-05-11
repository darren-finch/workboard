export default class Task {
	id: number
	title: string
	description: string
	tags: string[]

	constructor(id: number, title: string, description: string, tags: string[]) {
		this.id = id
		this.title = title
		this.description = description
		this.tags = tags
	}
}
