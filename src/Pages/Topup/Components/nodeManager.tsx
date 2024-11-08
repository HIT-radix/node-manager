import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useEffect } from "react";
import { useSelector } from "Store";
import { UnlockingRewards } from "Types/api";
import { StakingTokens } from "Types/reducers";
import { fetchValidatorInfo } from "Utils/fetchers";
import { calculateEstimatedUnlockDate, formatTokenAmount } from "Utils/format";
import { finishNodeLSUnlockProcess, unlockNodeEarnedLSUs } from "Utils/txSenders";

const NodeManager = () => {
  const {
    currentlyEarnedLockedLSUs,
    epoch,
    ownerLSUsInUnlockingProcess,
    totalStakedXrds,
    totalXrdsLeavingOurNode,
    unlockingLSUsBreakdown,
    unlockedLSUs,
  } = useSelector((state) => state.nodeManager);
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);

  useEffect(() => {
    (async () => {
      await fetchValidatorInfo();
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-12 w-[95vw] max-w-[650px] mb-5 gap-3">
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center">
          <InfoTile
            title="Total XRD staked in node"
            value={formatTokenAmount(+totalStakedXrds)}
            isLoading={validatorDataLoading}
            tooltip={totalStakedXrds}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 flex items-center justify-center ">
          <InfoTile
            title="Total XRD leaving our node"
            value={formatTokenAmount(+totalXrdsLeavingOurNode)}
            isLoading={validatorDataLoading}
            tooltip={totalXrdsLeavingOurNode}
          />
        </div>
      </div>

      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 1</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="Earned LSUs🔒 (owner only)"
          value={formatTokenAmount(+currentlyEarnedLockedLSUs)}
          isLoading={validatorDataLoading}
          tooltip={currentlyEarnedLockedLSUs}
        />
      </div>
      <GeneralOwnerInterface
        heading="Unlock Earned LSUs"
        placeholder="Enter LSU amount to unlock"
        balance={currentlyEarnedLockedLSUs}
        onButtonClick={async (amount) => {
          await unlockNodeEarnedLSUs(amount);
        }}
        btnText="Unlock Earned LSUs"
        tokenSymbol={StakingTokens.LSU}
      />
      <p className="mb-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 2</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="LSUs in unlocking process (owner only)"
          value={formatTokenAmount(+ownerLSUsInUnlockingProcess)}
          isLoading={validatorDataLoading}
          tooltip={ownerLSUsInUnlockingProcess}
        />
      </div>
      <UnlockingLSUsTable unlockingLSUsBreakdown={unlockingLSUsBreakdown} currentEpoch={epoch} />
      <p className="my-5 text-4xl text-secondary font-bold border-y border-secondary">STEP 3</p>
      <div className="min-w-[300px] mb-5">
        <InfoTile
          title="Unlocked LSUs🔓 (owner only)"
          value={formatTokenAmount(+unlockedLSUs)}
          isLoading={validatorDataLoading}
          tooltip={unlockedLSUs}
        />
      </div>
      <div
        onClick={async () => {
          if (Number(unlockedLSUs) > 0) {
            await finishNodeLSUnlockProcess(unlockedLSUs);
          }
        }}
        className={`btn btn-accent px-20 ${
          Number(unlockedLSUs) > 0 ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
        }`}
      >
        Claim Unlocked LSUs
      </div>
    </div>
  );
};

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

export default NodeManager;
