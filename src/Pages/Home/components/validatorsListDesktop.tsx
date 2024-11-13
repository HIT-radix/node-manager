import { useSelector } from "Store";
import { conciseAddress } from "Utils/format";
import hitLogo from "Assets/Images/hit-logo.png";

const ValidatorsListDesktop = () => {
  const { validatorsList } = useSelector((state) => state.session);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="overflow-x-auto">
        <table className="table text-white">
          <thead>
            <tr className="text-white text-center">
              <th>Address</th>
              <th>Total XRD Staked</th>
              <th>XRD Leaving</th>
              <th>Owner Stake</th>
            </tr>
          </thead>
          <tbody>
            {validatorsList.map((validator) => (
              <tr key={validator.address}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={validator.icon}
                          alt={`${validator.name}'s avatar`}
                          className="w-14 h-14 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = hitLogo;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{validator.name}</div>
                      <div className="text-sm opacity-50">
                        {conciseAddress(validator.address, 3, 20)}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{validator.stakeVaultBalance}</td>
                <td>{validator.pendingXrdWithdrawBalance}</td>
                <td>{validator.lockedOwnerStakeUnitVaultBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidatorsListDesktop;
