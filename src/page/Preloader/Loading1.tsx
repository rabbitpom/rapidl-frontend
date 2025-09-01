import DottedScroller from "@/components/ui/dotted-scroller";
import LoadingBarsMirrored from "@/components/custom/loading/loading1";

function Loading1() {
  return (
    <>
      <DottedScroller />
      <div className="flex absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-0">
        <LoadingBarsMirrored />
      </div>
    </>
  );
}

export default Loading1;
