import { StakingTokens } from "Types/reducers";
import { generateExplorerTxLink } from "Utils/format";

import { conciseAddress } from "Utils/format";
import { ReactNode } from "react";

const BaseToast = ({
  heading,
  subHeading,
  explorerLink,
  txId,
  twSubHeadingClass = "",
  twHeadingClass = "",
}: {
  heading: string;
  subHeading?: string | ReactNode;
  explorerLink?: string;
  txId?: string;
  twSubHeadingClass?: string;
  twHeadingClass?: string;
}) => {
  return (
    <div>
      <p className={"font-extrabold " + twHeadingClass}>{heading}</p>
      {subHeading ? <p className={"text-sm " + twSubHeadingClass}>{subHeading}</p> : null}
      {txId ? (
        <p
          className="mt-2 text-sm font-extrabold w-fit text-base-content cursor-pointer"
          onClick={() => window.open(explorerLink ?? generateExplorerTxLink(txId), "_blank")}
          style={{ borderBottom: "1px solid #293a24" }}
        >
          View transaction
        </p>
      ) : null}
    </div>
  );
};

export const StakeSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Stake Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">${token}</span>
          </span>
          staked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const UnStakeSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Unstake Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">${token}</span>
          </span>
          unstaked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const DistributeSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Distribute Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span>${token}</span>
          </span>
          Distributed successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const LockSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Lock Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span>${token}</span>
          </span>
          Locked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const NFTmintToast = ({ amount, txId }: { amount: string; txId: string }) => {
  return (
    <BaseToast
      heading="NFT mint Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">{amount} NFT</span>
          minted successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const AssignRewardSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Rewards Assign Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span>${token}</span>
          </span>
          rewards Assigned successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const ClaimSuccessToast = ({ txId }: { txId: string }) => {
  return (
    <BaseToast
      heading="Claim Transaction Successful"
      subHeading={`Rewards claimed successfully`}
      txId={txId}
    />
  );
};

export const ClaimAndStakeSuccessToast = ({ txId }: { txId: string }) => {
  return (
    <BaseToast
      heading="Claim And Stake Successful"
      subHeading={`Rewards claimed and HIT staked successfully`}
      txId={txId}
    />
  );
};

export const TxRejectedToast = () => {
  return (
    <BaseToast
      heading="Transaction Rejected"
      subHeading="Your transaction has been rejected."
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxCanceledToast = () => {
  return (
    <BaseToast
      heading="Transaction Canceled"
      subHeading="Your transaction has been canceled."
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxFailedToast = ({ txId }: { txId?: string }) => {
  return (
    <BaseToast
      heading="Transaction Failed"
      subHeading="Your transaction has failed."
      txId={txId}
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const TxProgressToast = () => {
  return <BaseToast heading="Processing Transaction" subHeading="Open your Radix Wallet app." />;
};

// export const TxSignToast = () => {
//   return (
//     <BaseToast
//       heading="Sign Transaction on Wallet"
//       subHeading="Waiting for wallet to sign the transaction. "
//     />
//   );
// };

export const WalletDiconnectedToast = () => {
  return (
    <BaseToast
      heading={`Radix Wallet Disconnected`}
      subHeading="Your wallet has been disconnected"
      twHeadingClass="text-red-800"
      twSubHeadingClass="text-red-600"
    />
  );
};

export const WalletConnectedToast = ({ walletAddress }: { walletAddress: string }) => {
  return (
    <BaseToast
      heading={`Radix Wallet Connected`}
      subHeading={conciseAddress(walletAddress, 7, 10)}
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
    />
  );
};

export const UnlockLSUSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Unlock Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">{token}s</span>
          </span>
          unlocked successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};

export const ClaimLSUSuccessToast = ({
  amount,
  token,
  txId,
}: {
  amount: string;
  token: StakingTokens;
  txId: string;
}) => {
  return (
    <BaseToast
      heading="Claim Transaction Successful"
      subHeading={
        <>
          <span className="font-semibold mr-1">
            {amount} <span className="mesh-text-gradient">{token}s</span>
          </span>
          claimed successfully.
        </>
      }
      twHeadingClass="text-base-content"
      twSubHeadingClass="text-base-content"
      txId={txId}
    />
  );
};
