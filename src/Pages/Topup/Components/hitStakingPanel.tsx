import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { distributeHITRewards, LockHITRewards } from "Utils/txSenders";

const HitStakingPanel = () => {
  const hitBalance = useSelector((state) => state.session.hitBalance);
  const lockedHITRewards = useSelector((state) => state.staking.lockedHITRewards);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const rugProofComponentDataLoading = useSelector(
    (state) => state.loadings.rugProofComponentDataLoading
  );
  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="min-w-[300px]">
          <InfoTile
            title="Your HIT Balance"
            value={formatTokenAmount(+hitBalance)}
            isLoading={balanceLoading}
            tooltip={hitBalance}
          />
        </div>
        <div className="min-w-[300px]">
          <InfoTile
            title="Total Locked Rewards"
            value={formatTokenAmount(+lockedHITRewards) + " " + StakingTokens.HIT}
            isLoading={rugProofComponentDataLoading}
            tooltip={lockedHITRewards}
          />
        </div>
      </div>
      <div className="mt-10">
        <GeneralOwnerInterface
          heading="Distribute HITs Reward"
          placeholder="Enter HIT amount to distribute"
          balance={hitBalance}
          onButtonClick={async (amount) => await distributeHITRewards(amount, false)}
          btnText="Distribute"
        />
        <GeneralOwnerInterface
          heading="Lock HITs for Future Rewards"
          placeholder="Enter HIT amount to lock"
          balance={hitBalance}
          onButtonClick={async (amount) => await LockHITRewards(amount)}
          btnText="Lock"
        />
        <GeneralOwnerInterface
          heading="Distribute Locked HITs reward"
          placeholder="Enter locked HIT amount to distribute"
          balance={lockedHITRewards}
          onButtonClick={async (amount) => await distributeHITRewards(amount, true)}
          btnText="Distribute"
        />
      </div>
    </div>
  );
};

export default HitStakingPanel;
