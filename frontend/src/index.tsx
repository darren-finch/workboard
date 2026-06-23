import * as ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/main.scss"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./layouts/modals/Modals"

const root = ReactDOM.createRoot(document.querySelector("#root")!)
root.render(<App />)
