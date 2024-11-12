import { dispatch, useSelector } from "Store";
import { setInputSearch } from "Store/Reducers/session";
import { fetchValidatorInfo } from "Utils/fetchers";

const InputSearch = () => {
  const inputSearch = useSelector((state) => state.session.inputSearch);

  return (
    <div className="flex items-center justify-center gap-3">
      <input
        value={inputSearch}
        onChange={(e) => dispatch(setInputSearch(e.target.value))}
        className="border border-white text-accent w-[90vw] max-w-[400px] p-2 rounded-lg"
        placeholder="search validator address"
      />
      <div className="btn btn-accent text-base-100" onClick={() => fetchValidatorInfo(inputSearch)}>
        Search
      </div>
    </div>
  );
};

export default InputSearch;
