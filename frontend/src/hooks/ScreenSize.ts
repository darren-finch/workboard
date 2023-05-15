import { useEffect, useState } from "react"

enum ScreenSize {
	XS = "xs",
	SM = "sm",
	MD = "md",
	LG = "lg",
	XL = "xl",
	XXL = "xxl",
}

const getScreenSize = (): ScreenSize => {
	const width = window.innerWidth
	if (width < 576) {
		return ScreenSize.XS
	} else if (width < 768) {
		return ScreenSize.SM
	} else if (width < 992) {
		return ScreenSize.MD
	} else if (width < 1200) {
		return ScreenSize.LG
	} else if (width < 1400) {
		return ScreenSize.XL
	} else {
		return ScreenSize.XXL
	}
}

const useScreenSize = (): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.XS)

	useEffect(() => {
		setScreenSize(getScreenSize())
		return window.addEventListener("resize", () => setScreenSize(getScreenSize()))
	}, [])

	return screenSize
}

export { ScreenSize, useScreenSize }
