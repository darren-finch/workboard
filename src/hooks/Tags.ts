import { useState } from "react"

export const useTags = (initialTags: string[]) => {
	const [tags, setTags] = useState(initialTags)

	const addTag = (tag: string) => {
		if (!tag) {
			return
		}

		const lowerCaseTag = tag.toLowerCase()
		if (!tags.includes(lowerCaseTag)) {
			setTags([...tags, lowerCaseTag])
		}
	}

	const removeTag = (tag: string) => {
		const lowerCaseTag = tag.toLowerCase()
		setTags(tags.filter((t) => t !== lowerCaseTag))
	}

	const clearTags = () => {
		setTags([])
	}

	return [tags, addTag, removeTag, clearTags] as const
}
