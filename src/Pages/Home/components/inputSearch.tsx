import { useState } from "react";
import { fetchValidatorInfo } from "Utils/fetchers";

const InputSearch = () => {
  const [inputAddress, setInputAddress] = useState("");

  return (
    <div className="flex items-center justify-center gap-3">
      <input
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        className="border border-white text-accent w-[90vw] max-w-[400px] p-2 rounded-lg"
        placeholder="search validator address"
      />
      <div
        className="btn btn-accent text-base-100"
        onClick={() => fetchValidatorInfo(inputAddress)}
      >
        Search
      </div>
    </div>
  );
};

export default InputSearch;
