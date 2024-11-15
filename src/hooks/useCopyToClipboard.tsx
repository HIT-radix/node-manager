import CachedService from "Classes/cachedService";

const useCopyToClipboard = () => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      CachedService.successToast("Copied to Clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);

      CachedService.successToast("Failed to copy to clipboard");
    }
  };

  return { copyToClipboard };
};

export default useCopyToClipboard;
