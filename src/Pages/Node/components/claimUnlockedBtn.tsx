import { useMemo } from "react";
import { useSelector } from "Store";
import { finishNodeLSUnlockProcess } from "Utils/txSenders";

const ClaimUnlockedBtn = () => {
  const unlockedLSUs = useSelector((state) => state.nodeManager.unlockedLSUs);
  const isOwner = useSelector((state) => state.session.isOwner);
  const metadata = useSelector((state) => state.nodeManager.metadata);

  const isEnabled = useMemo(() => {
    return Number(unlockedLSUs) > 0 && isOwner;
  }, [isOwner, unlockedLSUs]);

  return (
    <div
      onClick={async () => {
        if (isEnabled) {
          await finishNodeLSUnlockProcess(unlockedLSUs, metadata.owner_badge);
        }
      }}
      className={`btn btn-accent px-20 ${
        isEnabled ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-30"
      }`}
    >
      Claim
    </div>
  );
};

export default ClaimUnlockedBtn;
