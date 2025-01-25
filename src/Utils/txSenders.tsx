import { toast } from "react-toastify";

import { incrementSuccessTxCount } from "Store/Reducers/session";
import { StakingTokens } from "Types/reducers";
import { setTxInProgress } from "Store/Reducers/loadings";
import CachedService from "Classes/cachedService";
import { formatTokenAmount } from "./format";
import { store } from "Store";
import { getRdt } from "subs";
import {
  StakeSuccessToast,
  TxCanceledToast,
  TxFailedToast,
  TxProgressToast,
  ClaimLSUSuccessToast,
  UnlockLSUSuccessToast,
  UnstakeSuccessToast,
  WithdrawSuccessToast,
} from "Components/toasts";
import {
  getFinishUnlockLSUProcessManifest,
  getStakeInNodeValidatorManifest,
  getUnlockEarnedLSUManifest,
  getStartUnstakeFromValidatorManifest,
  getWithdrawFromNodeManifest,
} from "./manifests";

type Props = {
  amount: string;
  txManifest: string;
  tokenSymbol: StakingTokens;
  ToastElement: ({
    amount,
    token,
    txId,
  }: {
    amount: string;
    token: StakingTokens;
    txId: string;
  }) => JSX.Element;
};

const baseTxSender = async ({ amount, txManifest, ToastElement, tokenSymbol }: Props) => {
  const rdt = getRdt();
  let isSuccess = false;
  try {
    if (rdt) {
      store.dispatch(setTxInProgress(true));
      CachedService.TxProgressToast(<TxProgressToast />);
      console.log(txManifest);
      const result = await rdt.walletApi.sendTransaction({
        transactionManifest: txManifest,
        version: 1,
      });
      if (result.isErr()) throw result.error;
      toast.dismiss();
      CachedService.successToast(
        <ToastElement
          amount={formatTokenAmount(Number(amount))}
          token={tokenSymbol}
          txId={result.value.transactionIntentHash}
        />
      );
      afterSuccessChore();
      isSuccess = true;
      console.log("sendTransaction Result: ", result);
    }
  } catch (error: any) {
    afterErrorChore(error);
  }
  store.dispatch(setTxInProgress(false));
  return isSuccess;
};

const afterSuccessChore = () => {
  store.dispatch(incrementSuccessTxCount());
};

const afterErrorChore = (error: any) => {
  toast.dismiss();
  if (error?.error === "rejectedByUser") {
    CachedService.errorToast(<TxCanceledToast />);
  } else {
    CachedService.errorToast(<TxFailedToast />);
  }
  console.log("Unable to send Transaction", error);
};

export const stakeInNodeValidator = async (amount: string) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    await baseTxSender({
      amount,
      txManifest: getStakeInNodeValidatorManifest(walletAddress, amount),
      ToastElement: StakeSuccessToast,
      tokenSymbol: StakingTokens.XRD,
    });
  } catch (error) {
    console.log("Unable to stake in node validator");
  }
};

export const unlockNodeEarnedLSUs = async (
  amount: string,
  ownerBadgeId: string,
  validatorAddress: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    return await baseTxSender({
      amount,
      txManifest: getUnlockEarnedLSUManifest(walletAddress, amount, ownerBadgeId, validatorAddress),
      ToastElement: UnlockLSUSuccessToast,
      tokenSymbol: StakingTokens.LSU,
    });
  } catch (error) {
    console.log("Unable to unlock LSU in node validator");
  }
};

export const finishNodeLSUnlockProcess = async (
  amount: string,
  ownerBadgeId: string,
  validatorAddress: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    return await baseTxSender({
      amount: amount,
      txManifest: getFinishUnlockLSUProcessManifest(walletAddress, ownerBadgeId, validatorAddress),
      ToastElement: ClaimLSUSuccessToast,
      tokenSymbol: StakingTokens.LSU,
    });
  } catch (error) {
    console.log("Unable to finish unlock LSU process in node validator");
  }
};

export const startUnstakeFromNodeValidator = async (
  amount: string,
  validatorAddress: string,
  LSUAddress: string,
  claimNFTaddress: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    return await baseTxSender({
      amount: amount,
      txManifest: getStartUnstakeFromValidatorManifest(
        walletAddress,
        amount,
        validatorAddress,
        LSUAddress,
        claimNFTaddress
      ),
      ToastElement: UnstakeSuccessToast,
      tokenSymbol: StakingTokens.LSU,
    });
  } catch (error) {
    console.log("Unable to unstake from node validator");
  }
};

export const withdrawFromNodeValidator = async (
  amount: string,
  validatorAddress: string,
  claimNFTaddress: string,
  nftId: string
) => {
  try {
    const {
      app: { walletAddress },
    } = store.getState();

    return await baseTxSender({
      amount: amount,
      txManifest: getWithdrawFromNodeManifest(
        walletAddress,
        claimNFTaddress,
        nftId,
        validatorAddress
      ),
      ToastElement: WithdrawSuccessToast,
      tokenSymbol: StakingTokens.XRD,
    });
  } catch (error) {
    console.log("Unable to unstake from node validator");
  }
};
