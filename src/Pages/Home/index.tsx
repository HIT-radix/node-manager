import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";
import ValidatorsList from "./components/validatorsList";

const Home = () => {
  return (
    <div>
      <ValidatorsList />
      <NodeMetadata />
      <NodeManager />
    </div>
  );
};

export default Home;
