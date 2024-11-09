import { useState } from "react";
import { fetchValidatorInfo } from "Utils/fetchers";
import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";

const Home = () => {
  const [inputAddress, setInputAddress] = useState("");

  return (
    <div>
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
      <NodeMetadata />
      <NodeManager />
    </div>
  );
};

export default Home;
