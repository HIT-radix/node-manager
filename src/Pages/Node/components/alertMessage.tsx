import { useSelector } from "Store";

const AlertMessage = () => {
  const fees = useSelector((state) => state.nodeManager.fees);
  return (
    <div className="text-center text-warning font-semibold mt-4 mb-1">
      {fees.alert ? "⚠️ " + fees.alert : ""}
    </div>
  );
};

export default AlertMessage;
