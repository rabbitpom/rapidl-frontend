import { cn } from "@/lib/utils";
import "./verifying.css";

interface Props {
  success: boolean;
  completed: boolean;
  title?: string;
  success_text?: string;
  failure_text?: string;
}

function PortableVerifying({
  success,
  completed,
  title,
  success_text,
  failure_text,
}: Props) {
  return (
    <>
      {!completed && (
        <h1 className="text-center font-semibold text-xl">
          {title != null ? title : "Verifying"}
        </h1>
      )}
      {completed && success_text != null && success && (
        <h1 className="text-center font-semibold text-xl">{success_text}</h1>
      )}
      {completed && failure_text != null && !success && (
        <h1 className="text-center font-semibold text-xl">{failure_text}</h1>
      )}
      <div className="p-6 flex justify-center relative">
        <div
          className={cn(
            "circle-loader",
            completed && "load-complete",
            !success && completed && "fail"
          )}
        >
          <div
            className={cn(
              "draw",
              !completed ? "hidden" : "block",
              success ? "checkmark" : "cross"
            )}
          ></div>
        </div>
      </div>
    </>
  );
}

export default PortableVerifying;
