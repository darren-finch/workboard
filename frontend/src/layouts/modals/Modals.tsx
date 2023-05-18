import NiceModal from "@ebay/nice-modal-react"
import EditCardModal from "./EditCardModal"
import EditColumnModal from "./EditColumnModal"
import ConfirmationModal from "./ConfirmationModal"

NiceModal.register("edit-card-modal", EditCardModal)
NiceModal.register("edit-column-modal", EditColumnModal)
NiceModal.register("confirmation-modal", ConfirmationModal)
