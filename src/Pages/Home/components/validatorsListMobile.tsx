import { useSelector } from "Store";
import { conciseAddress } from "Utils/format";
import CachedService from "Classes/cachedService";
import hitLogo from "Assets/Images/hit-logo.png";
import { Copy } from "lucide-react";
import useCopyToClipboard from "hooks/useCopyToClipboard";

export const ValidatorsListMobile = () => {
  const { copyToClipboard } = useCopyToClipboard();

  const { validatorsList } = useSelector((state) => state.session);

  const handleClick = (address: string) => {
    CachedService.navigation(`/node/${address}`);
  };

  return (
    <>
      {validatorsList.map((validator, index) => (
        <div
          key={index}
          className={
            "collapse collapse-arrow text-accent bg-base-200 border border-secondary my-3 "
          }
        >
          <input type="checkbox" />
          <div className="collapse-title ">
            <div className="flex items-center gap-1 ml-2">
              <img
                onClick={() => handleClick(validator.address)}
                src={validator.icon}
                alt="logo"
                className="w-14 h-14 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = hitLogo;
                }}
              />
              <div className=" ml-2">
                <p
                  className="font-bold text-xl md:text-3xl"
                  onClick={() => handleClick(validator.address)}
                >
                  {validator.name}
                </p>
                <div className="flex items-center text-sm opacity-50">
                  {conciseAddress(validator.address, 3, 20)}
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => copyToClipboard(validator.address)}
                  >
                    <Copy size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="collapse-content flex flex-col items-center justify-center">
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
      ))}
    </>
  );
};

export default ValidatorsListMobile;
