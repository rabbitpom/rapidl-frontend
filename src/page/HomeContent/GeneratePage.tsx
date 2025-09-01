import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FunctionSquare, ScatterChart, Wrench, Sigma } from "lucide-react";
import { toast } from "sonner";
import Umami from "@/components/Umami";
import FlipNumbers from "react-flip-numbers";
import axios from "axios";

import PortableVerifying from "../VerifyingContent/PortableVerifying";
import { RootState } from "@/store/configure-store";
import { numberWithCommas } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Option {
  Title: string;
  Description: string;
  Icon?: any;
  Options?: any;
  MaxSelectedOptions?: number;
  Submit?: boolean;
  SubmitPayloadId?: string;
}

const Options: Option = {
  Title: "First, lets pick your subject",
  Description: "You can go back here if you change your mind",

  Options: {
    Math: {
      Title: "Great choice, select a topic",
      Icon: <Sigma />,

      Options: {
        Mechanics: {
          Title: "Pick up to 4 catagories",
          Description: "Each catagory is worth 1 credit",
          Icon: <Wrench />,

          Options: [
            "SUVAT",
            "Momentum",
            "Graphs",
            "Moments",
            "Pullies",
            "Inclined Slopes",
            "Projectiles",
            "Vectors",
          ],

          MaxSelectedOptions: 4,
          Submit: true,
          SubmitPayloadId: "MathsMechanics",
        },

        Statistics: {
          Title: "Pick up to 4 catagories",
          Description: "Each catagory is worth 1 credit",
          Icon: <ScatterChart />,

          Options: [
            "Probability",
            "Graphs",
            "Hypothesis Testing",
            "Normal Distribution",
            "Binomial Distribution",
          ],

          MaxSelectedOptions: 4,
          Submit: true,
          SubmitPayloadId: "MathsStatistics",
        },

        Core: {
          Title: "Pick up to 4 catagories",
          Description: "Each catagory is worth 1 credit",
          Icon: <FunctionSquare />,

          Options: [
            "Algebra",
            "Integration",
            "Differentiation",
            "Trigonometric Identities",
            "Coordinate Geometry",
            "Graphs",
            "Sequences and Series",
          ],

          MaxSelectedOptions: 4,
          Submit: true,
          SubmitPayloadId: "MathsCore",
        },
      },
    },
  },
};

interface Props {
  isMobile: boolean;
}

interface GenerateProps {
  isMobile: boolean;
  onSubmit: (arg0: { Navigations: String[]; Choices: String[] }) => void;
}

interface SubmitProps {
  isMobile: boolean;
  payload: { payload_id: string; choices: string[] };
  reset: () => void;
}

function GenerateQuery({ isMobile, onSubmit }: GenerateProps) {
  const payload = useRef<{
    Navigations: String[];
    Choices: String[];
  }>({
    Navigations: [],
    Choices: [],
  });
  const credits = useSelector((state: RootState) => state.userReducer.credits);
  const [pageNumber, setPageNumber] = useState(0);
  const [pages, setPages] = useState(1);
  const [optionsSelected, setOptionsSelected] = useState<{
    [key: string]: boolean;
  }>({});
  const [optionPointer, setOptionPointer] = useState([Options]);

  function toggleOption(option: string) {
    if (optionsSelected[option]) {
      const newOptionsState = { ...optionsSelected };
      delete newOptionsState[option];
      setOptionsSelected(newOptionsState);
      const index = payload.current.Choices.indexOf(option);
      if (index !== -1) {
        payload.current.Choices.splice(index, 1);
      }
      return;
    }
    const newOptionsState = { ...optionsSelected };
    newOptionsState[option] = true;
    setOptionsSelected(newOptionsState);
    payload.current.Choices.push(option);
  }
  function getOptionsSelectedCount() {
    return Object.keys(optionsSelected).length;
  }
  function reachedOptionsLimit(max: number) {
    return Object.keys(optionsSelected).length >= max;
  }

  return (
    <>
      <div className="h-auto">
        <div className="flex flex-col items-center">
          <div className="flex flex-col">
            {optionPointer[pageNumber].Title && (
              <p className="text-white text-center font-bold inline-block mt-32 text-xl">
                {optionPointer[pageNumber].Title}
              </p>
            )}
            {optionPointer[pageNumber].Description && (
              <p className="text-white text-center font-medium inline-block text-sm">
                {optionPointer[pageNumber].Description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 w-fit mt-10">
            {optionPointer[pageNumber].Submit
              ? optionPointer[pageNumber].Options.map((option: string) => {
                  return (
                    <Button
                      key={option}
                      variant="outline"
                      className={cn(
                        "min-w-32 h-14 gap-2 p-0",
                        optionsSelected[option] &&
                          "bg-primary text-black hover:bg-primary hover:font-bold hover:text-black"
                      )}
                      onClick={() => {
                        if (
                          !optionsSelected[option] &&
                          reachedOptionsLimit(
                            optionPointer[pageNumber]
                              .MaxSelectedOptions as number
                          )
                        ) {
                          toast.error(
                            `You can only select up to ${optionPointer[pageNumber].MaxSelectedOptions} options`
                          );
                          return;
                        }
                        toggleOption(option);
                      }}
                    >
                      {option}
                    </Button>
                  );
                })
              : Object.keys(optionPointer[pageNumber].Options).map((key) => {
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      className={cn(
                        "min-w-32 h-14 gap-2 p-0",
                        optionPointer[pageNumber + 1] ==
                          optionPointer[pageNumber].Options[key] &&
                          "bg-primary text-black font-bold"
                      )}
                      onClick={() => {
                        if (optionPointer.length - 1 > pageNumber) {
                          if (
                            optionPointer[pageNumber + 1] ==
                            optionPointer[pageNumber].Options[key]
                          ) {
                            setPageNumber(pageNumber + 1);
                            return;
                          } else {
                            payload.current.Choices = [];
                            setOptionsSelected({});
                            setOptionPointer(
                              optionPointer
                                .slice(0, pageNumber + 1)
                                .concat(optionPointer[pageNumber].Options[key])
                            );
                            setPages(pageNumber + 2);
                            setPageNumber(pageNumber + 1);

                            payload.current.Navigations =
                              payload.current.Navigations.slice(
                                0,
                                pageNumber
                              ).concat(key);
                            return;
                          }
                        }
                        setOptionsSelected({});
                        setOptionPointer([
                          ...optionPointer,
                          optionPointer[pageNumber].Options[key],
                        ]);
                        setPages(pages + 1);
                        setPageNumber(pageNumber + 1);

                        payload.current.Navigations.push(key);
                      }}
                    >
                      {optionPointer[pageNumber].Options[key].Icon}
                      {key}
                    </Button>
                  );
                })}
          </div>
          {optionPointer[pageNumber].Submit &&
            getOptionsSelectedCount() > 0 && (
              <>
                <div className="mt-8">
                  <h1 className="text-sm font-medium flex items-center gap-1">
                    This generation will require
                    <span className="font-bold">
                      <FlipNumbers
                        width={10}
                        height={15}
                        color="hsl(var(--primary))"
                        background="#ffffff00"
                        duration={2}
                        play
                        numbers={numberWithCommas(getOptionsSelectedCount())}
                      />
                    </span>
                    {getOptionsSelectedCount() > 1 ? "credits" : "credit"}.
                  </h1>
                  <h1 className="text-sm font-medium flex items-center gap-1">
                    You will have{" "}
                    <span className="font-bold">
                      <FlipNumbers
                        width={10}
                        height={15}
                        nonNumberStyle={{
                          color:
                            credits - getOptionsSelectedCount() >= 0
                              ? "hsl(var(--primary))"
                              : "red",
                        }}
                        color={
                          credits - getOptionsSelectedCount() >= 0
                            ? "hsl(var(--primary))"
                            : "red"
                        }
                        background="#ffffff00"
                        duration={2}
                        play
                        numbers={numberWithCommas(
                          credits - getOptionsSelectedCount()
                        )}
                      />
                    </span>
                    credits remaining.
                  </h1>
                </div>
                <Button
                  variant="default"
                  disabled={credits - getOptionsSelectedCount() < 0}
                  className="mt-6"
                  onClick={() => {
                    onSubmit(payload.current);
                  }}
                >
                  Generate
                </Button>
              </>
            )}
        </div>
      </div>
      <Pagination
        className={cn(
          "bottom-14 absolute w-[80%] left-0 right-0",
          isMobile ? "w-full px-5" : ""
        )}
      >
        <PaginationContent className={cn("", isMobile ? "gap-0" : "")}>
          {!isMobile && pageNumber > 0 && (
            <PaginationItem className="left-2 fixed">
              <PaginationPrevious
                onClick={() => {
                  setPageNumber(Math.max(pageNumber - 1, 0));
                }}
              />
            </PaginationItem>
          )}
          {Array(pages)
            .fill(null)
            .map((_, index) => {
              if (index == pageNumber) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive
                      onClick={() => {
                        setPageNumber(index);
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => {
                      setPageNumber(index);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          {!isMobile && pages != pageNumber + 1 && (
            <PaginationItem className="right-2 fixed">
              <PaginationNext
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}

function ReadyOption(option: string): string {
  const words = option.split(" ").map((word) => word.trim());
  const caseWords = words.map((word, _) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  const result = caseWords.join("");
  return result;
}

function GenerateSubmit({ payload, reset }: SubmitProps) {
  const [displayText, setDisplayText] = useState("Processing your request");
  const [success, setSuccess] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios
      .post("/generate", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((_response) => {
        setDisplayText(
          "Your request is now in the queue! Check out your content in the 'Content' section on the left."
        );
        setSuccess(true);
        setCompleted(true);
        Umami.logEvent("Generate content request");
      })
      .catch((_error) => {
        setDisplayText(
          "Something went wrong when processing your request. You have not been charged any credits for this."
        );
        setSuccess(false);
        setCompleted(true);
        Umami.logEvent("Generate content request failure");
      });
  }, []);

  return (
    <>
      <div className="h-auto">
        <div className="flex flex-col items-center py-20">
          <PortableVerifying success={success} completed={completed} />
          <p className="px-[20%]">{displayText}</p>
          {completed && (
            <Button variant="default" className="mt-6" onClick={reset}>
              Go back
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function GeneratePage({ isMobile }: Props) {
  const [payload, setPayload] = useState<null | {
    payload_id: string;
    choices: string[];
  }>(null);

  return (
    <>
      {payload ? (
        <GenerateSubmit
          isMobile={isMobile}
          payload={payload}
          reset={() => {
            setPayload(null);
          }}
        />
      ) : (
        <GenerateQuery
          isMobile={isMobile}
          onSubmit={(payload) => {
            let navigationPointer = Options;
            let payloadId = "";
            for (const option of payload.Navigations) {
              if (
                navigationPointer &&
                navigationPointer.Options &&
                navigationPointer.Options[option as string]
              ) {
                navigationPointer = navigationPointer.Options[option as string];
              } else {
                return;
              }
            }
            if (navigationPointer.SubmitPayloadId == null) {
              return;
            }
            payloadId = navigationPointer.SubmitPayloadId;

            let requestPayload = {
              choices: payload.Choices.map((option) =>
                ReadyOption(option as string)
              ),
              payload_id: payloadId,
            };
            setPayload(requestPayload);
          }}
        />
      )}
    </>
  );
}

export default GeneratePage;
