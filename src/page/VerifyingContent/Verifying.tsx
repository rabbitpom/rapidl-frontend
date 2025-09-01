import axios from "axios";
import Umami from "@/components/Umami";
import { useState, useEffect, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { forceUpdateUserSliceAsync } from "@/store/slices/user";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/configure-store";
import DottedScroller from "@/components/ui/dotted-scroller";
import RingCard from "@/components/ui/ring-card";
import "./verifying.css";

function Verifying() {
  let [searchParams, _] = useSearchParams();

  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedNode, setCompletedNode] = useState<null | ReactNode>(null);
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );

  useEffect(() => {
    let verifytoken = searchParams.get("token");
    if (!verifytoken) {
      setCompletedNode(
        <p>
          Oops! Invalid request 🙁
          <br />
          <br />
          Click the button below to return to the homepage.
        </p>
      );
      setSuccess(false);
      setCompleted(true);
      return;
    }
    new Promise((resolveSuccess, resolveError) => {
      try {
        axios
          .post(
            "/verify",
            { token: verifytoken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            resolveSuccess(response);

            Umami.logEvent("Verified success");
          })
          .catch((error) => {
            resolveError(error);
          });
      } catch (err) {
        resolveError(err);
      }
    })
      .then((response: any) => {
        if (typeof response?.data === "string") {
          setCompletedNode(
            <p>
              {response.data}
              <br />
              <br />
              Feel free to head back to the home page using the button below.
            </p>
          );
        } else {
          setCompletedNode(
            <p>
              Something went correctly, but the server returned invalid data.
              <br />
              <br />
              Feel free to head back to the home page using the button below.
            </p>
          );
        }
        setSuccess(true);
        setCompleted(true);

        // update the local user info
        if (!sessionEnded) {
          dispatch(forceUpdateUserSliceAsync() as any);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (typeof error.response?.data === "string") {
            setCompletedNode(
              <p>
                {error.response.data}
                <br />
                <br />
                Click the button below to return to the homepage.
              </p>
            );
          } else {
            setCompletedNode(
              <p>
                Something went wrong when sending the request.
                <br />
                <br />
                Click the button below to return to the homepage.
              </p>
            );
          }
        } else if (error.request) {
          setCompletedNode(
            <p>
              Something went wrong when sending the request.
              <br />
              <br />
              Click the button below to return to the homepage.
            </p>
          );
        } else {
          setCompletedNode(
            <p>
              Something went wrong.
              <br />
              <br />
              Click the button below to return to the homepage.
            </p>
          );
        }
        setSuccess(false);
        setCompleted(true);
      });
  }, []);

  return (
    <>
      <DottedScroller color="rgba(125, 125, 125, 50%)" />
      <div className="flex absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex-col items-center max-w-[400px]">
        <RingCard className="mt-0">
          {!completed && (
            <h1 className="text-center font-semibold text-xl">Verifying</h1>
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
          {completed ? (
            <>
              {completedNode}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/">HOME</Link>
              </Button>
            </>
          ) : (
            <p>
              We're currently verifying your request.
              <br />
              This might take a moment, please wait.
            </p>
          )}
        </RingCard>
      </div>
    </>
  );
}

export default Verifying;
