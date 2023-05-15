import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { convertToObject } from "typescript"

interface FormField {
	name: string
	printName: string | undefined
	value: any
	isValid: boolean
}

interface FormFieldContainer {
	[inputId: string]: FormField
}

const useFormFields = (
	initialState: FormFieldContainer,
	onValidSubmit?: () => void,
	onInvalidSubmit?: () => void
): [
	FormFieldContainer,
	boolean,
	(event: ChangeEvent<HTMLInputElement>) => void,
	(event: FormEvent<HTMLFormElement>) => void
] => {
	// The initial state of the form fields will be passed by the user
	// but we want to make sure the isValid property is set to true
	// for all the fields to avoid the form being invalid when it is first rendered.
	const [fields, setFields] = useState<FormFieldContainer>(
		Object.keys(initialState).reduce((acc, inputId) => {
			acc[inputId] = {
				...initialState[inputId],
				isValid: true,
			}
			return acc
		}, {} as FormFieldContainer)
	)
	const [wasValidated, setWasValidated] = useState<boolean>(false)

	const handleFormInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFields({
			...fields,
			[event.target.id]: {
				...fields[event.target.id],
				value: event.target.value,
				isValid: wasValidated ? event.target.validity.valid : true,
			},
		})
	}

	const checkFormValidity = (form: HTMLFormElement): boolean => {
		// We will use the native HTML5 validation API to check the validity of the form
		// then we will update the state of the form fields to reflect their validity

		let isValid = form.checkValidity()

		const newFields = { ...fields }

		Object.keys(fields).forEach((inputId) => {
			const input = document.getElementById(inputId) as HTMLInputElement
			if (input) {
				newFields[inputId].isValid = input.validity.valid
			}
		})

		setFields(newFields)

		return isValid
	}

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		event.stopPropagation()

		const form = event.currentTarget
		if (checkFormValidity(form)) {
			onValidSubmit && onValidSubmit()
		} else {
			onInvalidSubmit && onInvalidSubmit()
		}

		setWasValidated(true)
	}

	return [fields, wasValidated, handleFormInputChange, handleFormSubmit]
}

export default useFormFields
