import React, { useState, forwardRef } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import Form from "react-bootstrap/Form"

const CustomToggle = forwardRef<HTMLButtonElement, { onClick: (e: React.MouseEvent) => void }>(({ onClick }, ref) => (
	<button
		className="icon-btn text-white bi bi-three-dots-vertical"
		ref={ref}
		onClick={(e) => {
			e.preventDefault()
			onClick(e)
		}}
	/>
))

const CustomMenu = forwardRef<
	HTMLDivElement,
	{ children: React.ReactNode; style: React.CSSProperties; className: string; "aria-labelledby": string }
>(({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
	const [value, setValue] = useState("")

	return (
		<div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
			<ul className="list-unstyled mb-0">
				{React.Children.toArray(children).filter(
					(child) => !value || (child as React.ReactElement).props.children.toLowerCase().startsWith(value)
				)}
			</ul>
		</div>
	)
})

interface ContextButtonOption {
	key: string
	label: string
}

interface ContextButtonProps {
	options: ContextButtonOption[]
	onSelect: (optionKey: string) => void
}

const ContextButton: React.FC<ContextButtonProps> = ({ options, onSelect }) => (
	<Dropdown
		onSelect={(optionKey) => {
			if (optionKey) onSelect(optionKey)
		}}>
		<Dropdown.Toggle as={CustomToggle} />
		<Dropdown.Menu as={CustomMenu}>
			{options.map((option) => (
				<Dropdown.Item key={option.key} eventKey={option.key}>
					{option.label}
				</Dropdown.Item>
			))}
		</Dropdown.Menu>
	</Dropdown>
)

export default ContextButton
