import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";
import Listeners from "./components/listeners";
import NodeSkeletons from "./components/skeletons";
import { useSelector } from "Store";
import ToggleView from "./components/toggleView";

const Node = () => {
  const validatorDataLoading = useSelector((state) => state.loadings.validatorDataLoading);
  const validatorInfoFound = useSelector((state) => state.session.validatorInfoFound);
  return (
    <>
      <Listeners />
      {validatorDataLoading ? (
        <NodeSkeletons />
      ) : validatorInfoFound ? (
        <>
          <NodeMetadata />
          <ToggleView />
          <NodeManager />
        </>
      ) : (
        <div className="text-center my-20">
          <p className="text-accent font-semibold text-lg">No validator found :(</p>
        </div>
      )}
    </>
  );
};

export default Node;
