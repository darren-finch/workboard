import { v4 as uuid } from "uuid"
import Board from "../models/Board"
import Column from "../models/Column"
import Task from "../models/Task"
import { boardRepository } from "."

const boardId = "1"
const col1Id = uuid()
const col2Id = uuid()
const task1Id = uuid()
const task2Id = uuid()
const task3Id = uuid()
const task4Id = uuid()

const testBoard = new Board(boardId, "Test Board", [
	new Column(
		col1Id,
		"Todo",
		[
			new Task(task1Id, "Task 1", "This is a description", ["tag1", "tag2"], col1Id),
			new Task(task2Id, "Task 2", "This is another description", ["tag1"], col1Id),
		],
		boardId
	),
	new Column(
		col2Id,
		"Todo 2",
		[
			new Task(task3Id, "Task 3", "This is a description", ["tag1", "tag2"], col2Id),
			new Task(task4Id, "Task 4", "This is another description", ["tag1"], col2Id),
		],
		boardId
	),
])

export default testBoard
