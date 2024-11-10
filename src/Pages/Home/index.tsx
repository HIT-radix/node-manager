import NodeManager from "./components/nodeManager";
import NodeMetadata from "./components/nodeMetadata";
import InputSearch from "./components/inputSearch";

const Home = () => {
  return (
    <div>
      <InputSearch />
      <NodeMetadata />
      <NodeManager />
    </div>
  );
};

export default Home;
