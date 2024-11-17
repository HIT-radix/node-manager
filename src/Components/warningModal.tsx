import { useSelector } from "Store";

const WarningModal = () => {
  const warningModalMessage = useSelector((state) => state.session.warningModalMessage);
  return (
    <dialog id="warning_modal" className="modal">
      <div className="modal-box bg-base-content">
        <h3 className="font-bold text-accent text-lg">Alert!</h3>
        <p className="py-4 text-accent">{warningModalMessage}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default WarningModal;
