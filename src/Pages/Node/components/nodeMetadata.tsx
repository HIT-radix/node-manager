import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "Store";
import { conciseAddress } from "Utils/format";

const NodeMetadata = () => {
  const metadata = useSelector((state) => state.nodeManager.metadata);
  const fee = useSelector((state) => state.nodeManager.fees);
  const isNodeOwnerView = useSelector((state) => state.app.isNodeOwnerView);

  const [openAccordian, setOpenAccordian] = useState(false);

  const info = useMemo(() => {
    if (!metadata?.name && !metadata?.owner_badge) {
      return undefined;
    }
    return {
      name: metadata.name,
      description: metadata?.description ?? "",
      website: metadata?.info_url ?? "",
      logo: metadata?.icon_url ?? "",
      ownerBadge: metadata.owner_badge,
    };
  }, [metadata]);
  return (
    <div className={"flex items-center justify-center gap-3 ".concat(fee.alert ? "" : "mt-6")}>
      {info ? (
        <>
          <div
            className={"collapse border  bg-base-200 text-accent ".concat(
              isNodeOwnerView ? "border-secondary " : "border-accent"
            )}
          >
            <input
              type="radio"
              name="my-accordion-2"
              checked={openAccordian}
              onClick={() => setOpenAccordian(!openAccordian)}
              onChange={() => {}}
              className="cursor-pointer min-w-0"
            />
            <div className="relative collapse-title pe-4 text-xl font-medium">
              {openAccordian ? (
                <ChevronUp color="white" className="absolute right-0 mr-2" />
              ) : (
                <ChevronDown color="white" className="absolute right-0 mr-2" />
              )}
              <div className="flex items-center justify-center gap-1 flex-col">
                <img
                  src={info.logo}
                  alt="logo"
                  className="w-14 h-14 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://dashboard.radixdlt.com/_app/immutable/assets/validator-placeholder.VZYH4bqM.svg";
                  }}
                />
                <p
                  className={"font-bold text-xl md:text-3xl ".concat(
                    isNodeOwnerView ? "text-secondary" : "text-accent"
                  )}
                >
                  {info.name}
                </p>
              </div>
            </div>
            <div className="collapse-content flex flex-col items-center justify-center">
              {info.description && (
                <div className=" text-center flex flex-col items-center justify-center">
                  <p className="font-semibold text-sm text-secondary/80">Description:</p>
                  <p className="text-accent">{info.description}</p>
                </div>
              )}
              {info.website && (
                <>
                  <div className="border-t border-secondary w-1/2 my-3" />
                  <div className=" flex flex-col items-center justify-center">
                    <p className="font-semibold text-sm text-secondary/80">Website:</p>
                    <p
                      className="text-accent cursor-pointer hover:underline break-all"
                      onClick={() => window.open(info.website, "_blank")}
                    >
                      {info.website}
                    </p>
                  </div>
                </>
              )}
              <div className="border-t border-secondary w-1/2 my-3" />
              <div className=" flex flex-col items-center justify-center">
                <p className="font-semibold text-sm text-secondary/80">Fees:</p>
                <p className="text-accent break-all">{fee.current}</p>
              </div>
              <div className="border-t border-secondary w-1/2 my-3" />
              <div className=" flex flex-col items-center justify-center">
                <p className="font-semibold text-sm text-secondary/80">Owner Badge:</p>
                <p className="text-accent break-all">{conciseAddress(info.ownerBadge, 8, 8)}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default NodeMetadata;
