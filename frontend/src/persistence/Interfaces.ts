export interface RepositoryResponse<T> {
	success: boolean
	message: string
	value: T
}

export interface Unsubscribe {
	(): void
}
