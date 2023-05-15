import NiceModal from "@ebay/nice-modal-react"
import EditTaskModal from "./EditTaskModal"
import EditColumnModal from "./EditColumnModal"
import ConfirmationModal from "./ConfirmationModal"

NiceModal.register("edit-task-modal", EditTaskModal)
NiceModal.register("edit-column-modal", EditColumnModal)
NiceModal.register("confirmation-modal", ConfirmationModal)
