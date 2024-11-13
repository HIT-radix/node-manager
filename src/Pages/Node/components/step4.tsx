import GeneralOwnerInterface from "Components/generalOwnerInterface";
import InfoTile from "Components/infoTile";
import { useMemo } from "react";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { formatTokenAmount } from "Utils/format";
import { startUnstakeFromNodeValidator } from "Utils/txSenders";

const Step4 = () => {
  const { metadata, stakeUnitAddress, validatorAddress } = useSelector(
    (state) => state.nodeManager
  );
  const fungiblesBalances = useSelector((state) => state.session.userBalances.fungible);
  const balanceLoading = useSelector((state) => state.loadings.balanceLoading);
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);

  const userLSUBalance = useMemo(() => {
    let balance = "0";
    if (fungiblesBalances[stakeUnitAddress]) {
      balance = fungiblesBalances[stakeUnitAddress].amount;
    }
    return balance;
  }, [fungiblesBalances, stakeUnitAddress]);

  const handleUnstake = async (amount: string) => {
    if ("claim_nft" in metadata && stakeUnitAddress && validatorAddress) {
      await startUnstakeFromNodeValidator(
        amount,
        validatorAddress,
        stakeUnitAddress,
        metadata.claim_nft
      );
    }
  };
  const isExpandable = useMemo(() => +userLSUBalance > 0, [userLSUBalance]);
  return (
    <div
      className={"collapse text-accent bg-base-200 border "
        .concat(isExpandable ? "collapse-arrow " : "collapse-close ")
        .concat(isNodeOwnerView ? "border-secondary " : "border-accent ")}
    >
      <input type="checkbox" />
      <div className="collapse-title ">
        <p
          className={"font-medium text-xl mb-2 ".concat(
            isNodeOwnerView ? "text-secondary " : "text-accent "
          )}
        >
          Step {isNodeOwnerView ? "4" : "1"}: Start unstake from this Node
        </p>
        <div className="min-w-[300px] text-primary">
          <InfoTile
            title="Your LSUs balance of this node"
            value={formatTokenAmount(+userLSUBalance)}
            isLoading={balanceLoading}
            tooltip={userLSUBalance}
          />
        </div>
      </div>
      <div className="collapse-content text-primary flex items-center justify-center">
        <GeneralOwnerInterface
          heading=""
          placeholder="Enter LSU amount to unstake"
          balance={userLSUBalance}
          onButtonClick={(amount) => handleUnstake(amount)}
          btnText="Unstake from this node"
          tokenSymbol={StakingTokens.LSU}
          isOwner={true}
        />
      </div>
    </div>
  );
};

export default Step4;
