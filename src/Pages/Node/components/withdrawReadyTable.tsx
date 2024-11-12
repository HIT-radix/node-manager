import { useMemo } from "react";
import { useSelector } from "Store";
import { formatTokenAmount } from "Utils/format";
import { withdrawFromNodeValidator } from "Utils/txSenders";

const WithdrawReadyTable = () => {
  const epoch = useSelector((state) => state.nodeManager.epoch);
  const validatorAddress = useSelector((state) => state.nodeManager.validatorAddress);
  const metadata = useSelector((state) => state.nodeManager.metadata);
  const useUnstakeClaimNFTs = useSelector((state) => state.session.useUnstakeClaimNFTs);

  const filterPendingUnstake = useMemo(() => {
    return Object.values(useUnstakeClaimNFTs).filter((nft) => +nft.claim_epoch <= epoch);
  }, [epoch, useUnstakeClaimNFTs]);

  const handleWithdraw = async (amount: string, nftId: string) => {
    if ("claim_nft" in metadata && validatorAddress) {
      await withdrawFromNodeValidator(amount, validatorAddress, metadata.claim_nft, nftId);
    }
  };
  return (
    <div className="w-[95vw] max-w-[650px] ">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border-2 border-base-100 py-2">LSU amount</th>
            <th className="border-2 border-base-100 py-2">Available to Withdraw</th>
          </tr>
        </thead>
        <tbody>
          {filterPendingUnstake.map((nft, index) => (
            <tr key={index}>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                {formatTokenAmount(+nft.claim_amount)}
              </td>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                <div
                  className="btn bg-base-100 text-accent"
                  onClick={() => handleWithdraw(nft.claim_amount, nft.nftId)}
                >
                  Withdraw
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawReadyTable;
