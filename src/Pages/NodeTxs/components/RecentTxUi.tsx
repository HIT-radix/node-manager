import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useSelector } from "Store";
import { StakeType } from "Types/enum";
import { RecentStakingTx } from "Types/api";
import { conciseAddress } from "Utils/format";
import useCopyToClipboard from "hooks/useCopyToClipboard";

const RecentTxUi = () => {
  const { id: nodeAddress } = useParams<{ id: string }>();
  const recentTxs = useSelector((state) => (nodeAddress ? state.recentTxs[nodeAddress] || [] : []));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>

      {recentTxs.length === 0 ? (
        <div className="text-center text-secondary py-8">
          <p>No recent transactions found for this validator.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <RecentTxDesktop transactions={recentTxs} />
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            <RecentTxMobile transactions={recentTxs} />
          </div>
        </>
      )}
    </div>
  );
};

const RecentTxDesktop = ({ transactions }: { transactions: RecentStakingTx[] }) => {
  const { copyToClipboard } = useCopyToClipboard();

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: StakeType) => {
    return type === StakeType.Stake ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="overflow-x-auto">
      <table className="table text-white w-full">
        <thead>
          <tr className="text-white text-center">
            <th>Date</th>
            <th>Account</th>
            <th>Amount (XRD)</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={`${tx.account}-${index}`} className="hover:bg-base-200">
              <td className="text-center">{formatDate(tx.date)}</td>
              <td className="">
                <div className="flex items-center justify-center text-sm">
                  {conciseAddress(tx.account, 7, 7)}
                  <span
                    className="ml-2 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => copyToClipboard(tx.account)}
                  >
                    <Copy size={16} />
                  </span>
                </div>
              </td>
              <td className="text-center font-mono">
                {parseFloat(tx.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </td>
              <td className="text-center">
                <span className={`font-semibold ${getTypeColor(tx.type)}`}>
                  {tx.type === StakeType.Stake ? "Stake" : "Unstake"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RecentTxMobile = ({ transactions }: { transactions: RecentStakingTx[] }) => {
  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <TransactionCard key={`${tx.account}-${index}`} transaction={tx} />
      ))}
    </div>
  );
};

const TransactionCard = ({ transaction }: { transaction: RecentStakingTx }) => {
  const { copyToClipboard } = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: StakeType) => {
    return type === StakeType.Stake ? "text-green-400" : "text-red-400";
  };

  const getTypeCircle = (type: StakeType) => {
    const bgColor = type === StakeType.Stake ? "bg-green-400" : "bg-red-400";
    return <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>;
  };

  return (
    <div className="bg-base-200 border border-secondary rounded-[1rem] overflow-hidden">
      <div
        className="cursor-pointer flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">{getTypeCircle(transaction.type)}</div>
          <div>
            <div className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
              {transaction.type === StakeType.Stake ? "Stake" : "Unstake"}
            </div>
            <div className="text-sm text-secondary/70">{formatDate(transaction.date)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-mono font-semibold text-white">
              {parseFloat(transaction.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}{" "}
              XRD
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="text-white/50" />
          ) : (
            <ChevronDown className="text-white/50" />
          )}
        </div>
      </div>

      <div
        className="transition-max-height duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? "200px" : "0px",
        }}
      >
        <div className="p-4 pt-0 ">
          <div className="flex flex-col items-center justify-center">
            <p className="font-semibold text-sm text-secondary/80 mb-2">Account Address:</p>
            <div className="flex items-center text-sm break-all text-center">
              <span className="mr-2 text-white">{conciseAddress(transaction.account, 7, 7)}</span>
              <span
                className="text-white cursor-pointer opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(transaction.account);
                }}
              >
                <Copy size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTxUi;
