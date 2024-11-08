import { CommonTabClass } from "Components/tabs";

const Tabs = ({
  stakingType,
  setStakingType,
}: {
  stakingType: "Rug Proof" | "Validator" | "Validator Manager";
  setStakingType: (type: "Rug Proof" | "Validator" | "Validator Manager") => void;
}) => {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="tabs mb-3 bg-base-200 px-1.5 py-1.5 rounded-lg w-[90vw] max-w-[30rem] border border-secondary">
        <div
          role="tab"
          className={`${CommonTabClass} w-full ${stakingType === "Rug Proof" ? "bg-accent" : ""}`}
          onClick={() => setStakingType("Rug Proof")}
        >
          <p
            className={`my-1.5 ${
              stakingType === "Rug Proof" ? "tab-active text-primary" : "text-secondary"
            }`}
          >
            Rug Proof HIT Staking
          </p>
        </div>
        <div
          role="tab"
          className={`${CommonTabClass} w-full ${
            stakingType === "Validator" ? "bg-accent" : ""
          } h-full`}
          onClick={() => setStakingType("Validator")}
        >
          <p
            className={`my-1.5 ${
              stakingType === "Validator" ? "tab-active text-primary" : "text-secondary"
            }`}
          >
            ADDIX FOMO Validator Staking
          </p>
        </div>
        <div
          role="tab"
          className={`${CommonTabClass} w-full ${
            stakingType === "Validator Manager" ? "bg-accent" : ""
          } h-full`}
          onClick={() => setStakingType("Validator Manager")}
        >
          <p
            className={`my-1.5 ${
              stakingType === "Validator Manager" ? "tab-active text-primary" : "text-secondary"
            }`}
          >
            Node Manager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
