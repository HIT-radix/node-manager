import { useSelector } from "Store";
import { UnstakeClaimNFT } from "Types/api";
import { calculateEstimatedUnlockDate, formatTokenAmount } from "Utils/format";

const UnstakingLSUsTable = ({ pendingUnstakes }: { pendingUnstakes: UnstakeClaimNFT[] }) => {
  const epoch = useSelector((state) => state.nodeManager.epoch);

  return (
    <div className="w-[95vw] max-w-[650px] ">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border-2 border-base-100 py-2">LSU amount</th>
            <th className="border-2 border-base-100 py-2">Available for unstake</th>
          </tr>
        </thead>
        <tbody>
          {pendingUnstakes.map((nft, index) => (
            <tr key={index}>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                {formatTokenAmount(+nft.claim_amount)}
              </td>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                {calculateEstimatedUnlockDate(+nft.claim_epoch, epoch)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnstakingLSUsTable;
