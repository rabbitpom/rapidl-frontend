import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { backOff } from "exponential-backoff";
import { ParseRawContent, CONTENT, RAW_CONTENT_PAYLOAD } from "./decoder";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import DottedScroller from "@/components/ui/dotted-scroller";
import RingCard from "@/components/ui/ring-card";
import PortableVerifying from "../VerifyingContent/PortableVerifying";
import ContentRender from "./ContentRender";

function StringToColor(str: string, a: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgba(${r},${g},${b},${a})`;
}

function DesktopContent() {
  const [documentLoadSuccess, setDocumentLoadSuccess] = useState(false);
  const [documentLoadComplete, setDocumentLoadComplete] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [focusedQuestion, _setFocusedQuestion] = useState(null);
  const [content, setContent] = useState<null | CONTENT>(null);
  const [_rawContent, setRawContent] = useState<null | RAW_CONTENT_PAYLOAD>(
    null
  );

  const Location = useRef(useLocation());
  const Path = useRef(Location.current.pathname.split("/"));
  const JobId = useRef(Path.current[Path.current.length - 1]);

  /*
  useEffect(() => {
    const raw = JSON.parse(
      '{"status":"Success","content":{"blob":"H4sIAAAAAAAA/9WYzY7aVhTHNX2Ss/QI2/IX45lIs5hGpU2iJIOGZIUiXewL3BljE9+LSYS8yCOENuqqajZNd32DPgizaNI36bGpbcCGQgaiVBppBuaec//n68cx73588/v3YTAaUnc6nb27gA7xPBkuZWAcBoFLPY+6QDgQGJJQMMejQHwX/xVRDmMm+uAEPhfEF0Ach3o0JIIFPkgWq9nXxwP+QjFUuBAg2IBCC87BAE7RxuVwOb8kYn5v7iqiXuAw8RokRWc1c26u3x79kOlqS+0BEf1Od3IZt4/vLBLddWiP+ZMheg3Zqxisdp+ISXYJi+OavfTOdRy3qe/mBm1BX4nJgMcvJoqBkopQC6mtOIm6fZzHvRzF2iSU1Sl6SZ65tTwd73r75sMVXuTRn6YzqcEwR6JPixuDLtaEiLRMZiZXnX1beXIlCjRbCdksQlbfv5/OPj3zXRomZZg7Y76gvZB4ibOlsmBCsotkiNDTA4kcQw3uq3AVeGmmukGY11SG+3Km2pDTyndRcHKM4KHB0KOCAn05mntPTCMVMCZsKbyAjzpcMDESicE88hFP/k40doMRulu2BRFAj4pUmWSymq7ljWp8VohF3qL4vI02eT0J1lN2RS177aQtVp2EwouTzkZ1QTaGtigEz/4b57K8lZY0Sx2pazu15CJ/fr6AoUd8KkPz7gBSTKaYlQSq55PY3EAgNDfywj7MlRXZaB4GQUoppcr2Q76RQfVKBjV3ZFBZnrFTwaf/yaBmNs3W9gxqVjPIWmHQxy/AoPoeGGTtwiANGZR3qv5VI8g6AIK0MoJ2I1DRj9+1UNUw4CzVE1FHoKS0I0PqociIJook00Y2nFynYyMpZ0w5xfRn5dfU2V9r3Ky066LP8qCZdnnQTjYHlgqqGNmzkqfTbTJUMVLnGlZ/9jAfxh1yRRYIbBeD/esmX4dPGKlA5bm9QI3p7dEvTwIkOoV+ME6FvhxRno0Q4TfZHBAff/iYhtUJkNE2wSzFQzCm4OB51vODEGdUAPUFQ7PXKjwQMA5Gngt+IKBD0xsdwvFUNzmIF+Inzfr7kuNByDAz8FSFDTDIOYqiXMbx482hA5qMMU9xFyW4e7Ru1B/luNO2wx3fhDt7MxR4xoFEmaSrdQ2Rd5b8wrm7/ca+S33200dfvrhFwz5NifxZlS6c8BXsRyvYv9kK+zdrsG9vj31eiX1exn7aBiX0n5XeXQ+36tWzsYfVU9eYUv30W+yejfW7p86U+sbVs3Gg1VMvJVTZ0/Nv9e7Z2G33LD3+KvU9P/42Mqrp26+ejerVU19ZPf/+n6ye+i6rp6WzmlF8UWN+1cunfoDl0yp/JWPs9p3M0Z+GZliKVlcMq6Xb97STe5amGie6ZWvaqfHHY3TDH1OnT3zm8Le/XT17ftH6B5RL3xa4EwAA","createdat":"2024-05-24T17:06:38.931390","finishedon":"2024-05-24T17:06:40.293067","displayname":"","options":"SUVAT","category":"MathsMechanics","creditsused":1}}'
    );
    setRawContent(raw);
    ParseRawContent("ec3fc67b26df441c9671147f01423e56", raw)
      .then((ret: CONTENT | void) => {
        if (!ret) {
          return;
        }
        setContent(ret);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  */

  useEffect(() => {
    backOff(
      () => {
        return axios.get(`/generated/content?id=${JobId.current}`);
      },
      {
        maxDelay: 5000,
        numOfAttempts: 4,
        startingDelay: 300,
      }
    )
      .then((response) => {
        setRawContent(response.data);
        ParseRawContent(JobId.current, response.data)
          .then((ret: CONTENT | void) => {
            if (!ret) {
              return;
            }
            setContent(ret);
            setDocumentLoadSuccess(true);
            setDocumentLoadComplete(true);
          })
          .catch((err) => {
            console.log(err);
            setDocumentLoadSuccess(false);
            setDocumentLoadComplete(true);
          });
      })
      .catch((err) => {
        console.log(err);
        setDocumentLoadSuccess(false);
        setDocumentLoadComplete(true);
      });
  }, []);

  return (
    <>
      <div className="fixed bottom-1/2 top-1/2 right-0 z-0">
        <button
          className={cn(
            `mr-2 flex items-center bg-black rounded-full transition-all transform perspective-800 duration-200 hover:mr-4 hover:scale-[105%] hover:bg-primary`,
            `${
              expanded ? "p-0 translate-x-[100%] mr-0" : "p-4 translate-x-[0%]"
            }`
          )}
          onClick={() => setExpanded(!expanded)}
        >
          <img
            className={`size-12 pointer-events-none`}
            src="/company/logo.svg"
            alt="Logo of company"
          />
        </button>
      </div>
      <div className="fixed bottom-0 left-0 p-4 pointer-events-none">
        <div className="flex items-center">
          <img
            className={`size-8`}
            src="/company/logo.svg"
            alt="Logo of company"
          />
          <h1 className="font-bold text-xl pl-2">rapidl</h1>
        </div>
      </div>
      <DottedScroller />
      <div className="flex justify-center items-start min-h-screen p-4">
        <RingCard
          className={`transition-all duration-300 bg-black relative ${
            expanded
              ? "transform translate-x-[-30%] w-[45%]"
              : "w-[60%] max-w-[900px]"
          } mx-auto shadow-md p-8 min-h-screen`}
        >
          {content ? (
            <div className="flex flex-col min-h-screen">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary">
                  {content.name}
                </h1>
                <Badge className="text-center">{content.category}</Badge>
              </div>
              <div className="relative">
                <div className="flex justify-between items-center my-1 absolute top-0 right-0">
                  <div
                    className="w-[100%] grid grid-cols-2 gap-1"
                    style={{ direction: "rtl" }}
                  >
                    {content.options.map((item, index) => (
                      <Badge
                        key={index}
                        className="text-center font-light w-fit"
                        style={{
                          backgroundColor: `${StringToColor(item, 0.5)}`,
                          direction: "ltr",
                        }}
                        variant="outline"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <ul className="text-sm font-light">
                <li className="text-base font-medium text-primary mb-1">
                  {`${content.creditsused} credit${
                    content.creditsused > 1 ? "s" : ""
                  }`}
                </li>
                <li>{`Created on ${content.createdat.date} at ${content.createdat.time}`}</li>
                <li>{`Finished on ${content.finishedon.date} at ${content.finishedon.time}`}</li>
              </ul>
              <Separator className="my-4" />
              <ContentRender content={content} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[90vh]">
              <PortableVerifying
                success={documentLoadSuccess}
                completed={documentLoadComplete}
                failure_text="Could not load document"
                title={"Document loading"}
              ></PortableVerifying>
            </div>
          )}
        </RingCard>
        {expanded && (
          <div className="w-[30%] max-w-[600px] fixed top-0 right-0 h-full bg-black shadow-md p-8 z-10">
            {focusedQuestion == null ? (
              <>
                <div className="flex flex-col items-start justify-center h-[90vh]">
                  <h1 className="text-2xl font-bold">
                    Click on a question to start the conversation
                  </h1>
                  <h2 className="text-base font-thin">
                    Chat history will be deleted after one day from the last
                    message. For more information, please refer to our Privacy
                    Policy.
                  </h2>
                  <Separator className="mt-2 mb-6" />
                  <Button variant="outline" onClick={() => setExpanded(false)}>
                    Go back
                  </Button>
                </div>
              </>
            ) : (
              <p>TODO</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DesktopContent;
