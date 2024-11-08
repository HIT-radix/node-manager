import { useMemo, useState } from "react";

import { AMOUNT_INPUT_REGEX } from "Constants/misc";
import { useSelector } from "Store";
import { StakingTokens } from "Types/reducers";
import { validateDecimalPlaces } from "Utils/judgers";
import { BN } from "Utils/format";

type Props = {
  heading: string;
  placeholder: string;
  balance: string;
  onButtonClick: (amount: string) => Promise<void>;
  btnText: string;
  tokenSymbol?: StakingTokens;
};

const GeneralOwnerInterface = ({
  balance,
  onButtonClick,
  heading,
  placeholder,
  btnText,
  tokenSymbol = StakingTokens.HIT,
}: Props) => {
  const [amount, setAmount] = useState("");
  const walletAddress = useSelector((state) => state.app.walletAddress);
  const txInProgress = useSelector((state) => state.loadings.txInProgress);

  const isInSufficientBalance = useMemo(() => {
    return BN(amount).isGreaterThan(balance);
  }, [amount, balance]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.match(AMOUNT_INPUT_REGEX)) {
      if (validateDecimalPlaces(text, 18)) {
        setAmount(text);
      }
    } else {
      setAmount("");
    }
  };

  const isDisabled = useMemo(
    () => txInProgress || isInSufficientBalance || +balance === 0 || Number(amount) === 0,
    [txInProgress, isInSufficientBalance, balance, amount]
  );

  const BtnText = useMemo(
    () =>
      !walletAddress
        ? "Connect Wallet"
        : !amount
        ? "Enter an amount"
        : isInSufficientBalance
        ? `Insufficient ${tokenSymbol}`
        : txInProgress
        ? "Processing"
        : btnText,
    [amount, tokenSymbol, isInSufficientBalance, txInProgress, walletAddress, btnText]
  );

  const handleClick = async () => {
    if (!isDisabled) {
      await onButtonClick(amount);
      setAmount("");
    }
  };

  return (
    <div className="w-full mb-12 flex flex-col items-center justify-center">
      <p className="text-accent text-center text-2xl font-bold">{heading}</p>
      <input
        value={amount}
        type="text"
        placeholder={placeholder}
        onChange={onValueChange}
        className="input w-full max-w-xs bg-base-200 text-accent focus:outline-none focus:border-accent mt-4"
      />
      <div
        onClick={handleClick}
        className={`btn btn-accent mt-4 px-20 ${
          isDisabled ? "cursor-not-allowed opacity-30" : "cursor-pointer opacity-100"
        }`}
      >
        {BtnText}
      </div>
    </div>
  );
};

export default GeneralOwnerInterface;
