import { useParams } from "react-router-dom";
import { History } from "lucide-react";
import CachedService from "Classes/cachedService";

const RecentTransactionsButton = () => {
  const { id: nodeAddress } = useParams<{ id: string }>();

  const handleClick = () => {
    if (nodeAddress) {
      CachedService.navigation(`/tx/${nodeAddress}`);
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-2">
      <button
        onClick={handleClick}
        className="btn btn-outline btn-accent flex items-center gap-2 px-6 py-2 hover:btn-accent hover:text-base-100 transition-all duration-200"
      >
        <History size={18} />
        Check Recent Transactions
      </button>
    </div>
  );
};

export default RecentTransactionsButton;
