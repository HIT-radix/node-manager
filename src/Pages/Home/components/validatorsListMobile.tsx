import { useCallback, useState } from "react";
import { useSelector } from "Store";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { conciseAddress } from "Utils/format";
import CachedService from "Classes/cachedService";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { ValidatorItem } from "Types/api";

export const ValidatorsListMobile = () => {
  const { validatorsList } = useSelector((state) => state.session);

  const renderValidatorsList = useCallback(
    () => validatorsList.map((validator) => <AccordianCard validator={validator} />),
    [validatorsList]
  );

  return <>{renderValidatorsList()}</>;
};

const AccordianCard = ({ validator }: { validator: ValidatorItem }) => {
  const { copyToClipboard } = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (address: string) => {
    CachedService.navigation(`/node/${address}`);
  };
  return (
    <div
      key={validator.address}
      className="text-accent bg-base-200 border border-secondary my-3 rounded-[1rem]"
    >
      <div className="cursor-pointer flex justify-between p-3" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-1">
          <img
            onClick={() => handleClick(validator.address)}
            src={validator.icon}
            alt="logo"
            className="w-14 h-14 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://dashboard.radixdlt.com/_app/immutable/assets/validator-placeholder.VZYH4bqM.svg";
            }}
          />
          <div className="ml-2">
            <p
              className="font-bold text-lg md:text-2xl"
              onClick={() => handleClick(validator.address)}
            >
              {validator.name}
            </p>
            <div className="flex items-center text-sm opacity-50">
              {conciseAddress(validator.address, 3, 20)}
              <span
                className="ml-2 "
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(validator.address);
                }}
              >
                <Copy size={16} />
              </span>
            </div>
          </div>
        </div>
        <div className="ml-2 mt-2">{isOpen ? <ChevronUp /> : <ChevronDown />}</div>
      </div>

      <div
        className={`transition-max-height duration-300 ease-in-out overflow-hidden`}
        style={{
          maxHeight: isOpen ? "500px" : "0px",
        }}
      >
        <div className="p-3 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <p className="font-semibold text-sm text-secondary/80">Total XRD Staked:</p>
            <p className="text-accent cursor-pointer hover:underline break-all">
              {validator.stakeVaultBalance}
            </p>
          </div>
          <div className="border-t border-secondary w-3/4 my-3" />
          <div className="flex flex-col items-center justify-center">
            <p className="font-semibold text-sm text-secondary/80">XRD Leaving:</p>
            <p className="text-accent break-all">{validator.pendingXrdWithdrawBalance}</p>
          </div>
          <div className="border-t border-secondary w-3/4 my-3" />
          <div className="flex flex-col items-center justify-center">
            <p className="font-semibold text-sm text-secondary/80">Owner Stake:</p>
            <p className="text-accent break-all">{validator.lockedOwnerStakeUnitVaultBalance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsListMobile;
