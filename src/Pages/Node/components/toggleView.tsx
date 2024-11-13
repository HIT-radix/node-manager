import { dispatch, useSelector } from "Store";
import { setIsNodeOwnerView } from "Store/Reducers/app";

const ToggleView = () => {
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);
  return (
    <div className="flex items-center justify-center text-accent gap-2 text-lg font-semibold my-5">
      <p className="text-accent">Normal User</p>
      <input
        type="checkbox"
        className="toggle checked:bg-secondary checked:hover:bg-secondary bg-accent hover:bg-accent"
        checked={isNodeOwnerView}
        onChange={(e) => {
          dispatch(setIsNodeOwnerView(e.target.checked));
        }}
      />
      <p className="text-secondary">Node Owner</p>
    </div>
  );
};

export default ToggleView;
