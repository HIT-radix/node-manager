import { dispatch, useSelector } from "Store";
import { conciseAddress } from "Utils/format";
import CachedService from "Classes/cachedService";
import { Copy } from "lucide-react";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { setWarningModalMessage } from "Store/Reducers/session";

const ValidatorsListDesktop = () => {
  const { copyToClipboard } = useCopyToClipboard();

  const validatorsList = useSelector((state) =>
    state.session.isTop100View
      ? state.session.validatorsList
      : state.app.walletAddress
      ? state.session.userValidatorsList
      : state.session.validatorsList
  );

  const handleClick = (address: string) => {
    CachedService.navigation(`/node/${address}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table text-white">
        <thead>
          <tr className="text-white text-center">
            <th>Position</th>
            <th>Address</th>
            <th>Total XRD Staked</th>
            <th>XRD Leaving</th>
            <th>Fee %</th>
            <th>Owner Stake</th>
          </tr>
        </thead>
        <tbody>
          {validatorsList.map((validator) => (
            <tr key={validator.address}>
              <td className="text-center font-semibold">{validator.position}</td>
              <td className="">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12 cursor-pointer">
                      <img
                        onClick={() => handleClick(validator.address)}
                        src={validator.icon}
                        alt={`${validator.name}'s avatar`}
                        className="w-14 h-14 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://dashboard.radixdlt.com/_app/immutable/assets/validator-placeholder.VZYH4bqM.svg";
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold cursor-pointer hover:underline"
                      onClick={() => handleClick(validator.address)}
                    >
                      {validator.name}
                    </div>
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
              </td>
              <td className="text-center">{validator.stakeVaultBalance}</td>
              <td className="text-center">{validator.pendingXrdWithdrawBalance}</td>
              <td
                className={"text-center ".concat(
                  validator.fee.alert ? " cursor-pointer hover:underline" : ""
                )}
                onClick={() => {
                  if (validator.fee.alert) {
                    dispatch(setWarningModalMessage(validator.fee.alert));
                    (document.getElementById("warning_modal") as HTMLDialogElement).showModal();
                  }
                }}
              >
                {validator.fee.alert ? "⚠️" : ""}
                {validator.fee.current}
              </td>
              <td className="text-center">{validator.lockedOwnerStakeUnitVaultBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValidatorsListDesktop;
