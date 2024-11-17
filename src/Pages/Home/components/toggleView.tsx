import { dispatch, useSelector } from "Store";
import { setIsTop100View } from "Store/Reducers/session";

const ToggleView = () => {
  const userValidatorsList = useSelector((state) => state.session.userValidatorsList);
  const isTop100View = useSelector((state) => state.session.isTop100View);

  return userValidatorsList.length > 0 ? (
    <div className="flex items-center justify-center text-accent gap-2 text-lg font-semibold my-5">
      <p className="text-accent">Your Staked Nodes</p>
      <input
        type="checkbox"
        className="toggle checked:bg-secondary checked:hover:bg-secondary bg-accent hover:bg-accent"
        checked={isTop100View}
        onChange={(e) => {
          dispatch(setIsTop100View(e.target.checked));
        }}
      />
      <p className="text-secondary">Top 100 Nodes</p>
    </div>
  ) : null;
};

export default ToggleView;
