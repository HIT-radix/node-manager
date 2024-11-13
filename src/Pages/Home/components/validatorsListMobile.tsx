import { useSelector } from "Store";
import { conciseAddress } from "Utils/format";
import hitLogo from "Assets/Images/hit-logo.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ValidatorsListMobile = () => {
  const { validatorsList } = useSelector((state) => state.session);

  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  const handleAccordionToggle = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  return (
    <>
      {validatorsList.map((validator, index) => (
        <div
          key={validator.address}
          className="collapse border border-secondary bg-base-200 text-accent mt-6"
        >
          <input
            type="radio"
            name="accordion"
            checked={openAccordionIndex === index}
            onClick={() => handleAccordionToggle(index)}
            onChange={() => {}}
            className="cursor-pointer min-w-0"
          />
          <div className="relative collapse-title pe-4 text-xl font-medium">
            {openAccordionIndex === index ? (
              <ChevronUp color="white" className="absolute right-0 mr-2" />
            ) : (
              <ChevronDown color="white" className="absolute right-0 mr-2" />
            )}
            <div className="flex items-center gap-1 ml-2">
              <img
                src={validator.icon}
                alt="logo"
                className="w-14 h-14 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = hitLogo;
                }}
              />
              <div className=" ml-2">
                <p className="font-bold text-xl md:text-3xl">{validator.name}</p>
                <p className="text-sm opacity-50">{conciseAddress(validator.address, 3, 20)}</p>
              </div>
            </div>
          </div>
          {openAccordionIndex === index && (
            <div className="collapse-content flex flex-col items-center justify-center">
              <div className="border-t border-secondary w-1/2 my-3" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-sm text-secondary/80">Total XRD Staked:</p>
                <p className="text-accent cursor-pointer hover:underline break-all">
                  {validator.stakeVaultBalance}
                </p>
              </div>
              <div className="border-t border-secondary w-1/2 my-3" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-sm text-secondary/80">XRD Leaving:</p>
                <p className="text-accent break-all">{validator.pendingXrdWithdrawBalance}</p>
              </div>
              <div className="border-t border-secondary w-1/2 my-3" />
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-sm text-secondary/80">Owner Stake:</p>
                <p className="text-accent break-all">
                  {validator.lockedOwnerStakeUnitVaultBalance}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ValidatorsListMobile;
