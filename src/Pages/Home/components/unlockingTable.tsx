import { UnlockingRewards } from "Types/api";
import { calculateEstimatedUnlockDate, formatTokenAmount } from "Utils/format";

const UnlockingLSUsTable = ({
  unlockingLSUsBreakdown,
  currentEpoch,
}: {
  unlockingLSUsBreakdown: UnlockingRewards;
  currentEpoch: number;
}) => {
  return (
    <div className="w-[95vw] max-w-[650px] ">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border-2 border-base-100 py-2">LSU amount</th>
            <th className="border-2 border-base-100 py-2">Available for unlock</th>
          </tr>
        </thead>
        <tbody>
          {unlockingLSUsBreakdown.map((reward, index) => (
            <tr key={index}>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                {formatTokenAmount(+reward.stake_unit_amount)}
              </td>
              <td className="border-2 border-base-100 px-4 py-2 text-center">
                {calculateEstimatedUnlockDate(reward.epoch_unlocked, currentEpoch)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnlockingLSUsTable;
