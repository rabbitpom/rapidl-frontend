import { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useLocation, Link } from "react-router-dom";

import {
  Desktop,
  useDesktopMediaQuery,
} from "@/components/custom/responsive/device";

import { Button } from "@/components/ui/button";
import NavigationBar from "./Template/NavigationBar";
import FooterBar from "./Template/FooterBar";
import PlainPageContainer from "./Template/PlainPageContainer";
import DottedScroller from "@/components/ui/dotted-scroller";
import HoverableImage from "@/components/custom/image/hoverable-image";

interface Props {
  code: string;
  messages?: string[];
}

function Error({ code, messages = ["Something went wrong"] }: Props) {
  const Location = useLocation();

  const message = useRef(messages[Math.floor(Math.random() * messages.length)]);
  const [beginMessageType, setBeginMessageType] = useState(false);
  const typeSpeed = 80;
  const typeInitialTime = code.length * 0.5 * typeSpeed;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setBeginMessageType(true);
    }, typeInitialTime);

    return () => {
      clearTimeout(timeOut);
    };
  }, [typeInitialTime]);

  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <PlainPageContainer ringCard={false}>
        <div
          className={
            "flex absolute top-1/2 left-1/2 translate-x-[-50%] " +
            (useDesktopMediaQuery()
              ? "translate-y-[-150%]"
              : "translate-y-[-50%]")
          }
        >
          <Desktop>
            <HoverableImage
              src="/icons/mascot-internalError.png"
              alt="icon of error"
              className="pointer-events-none w-[250px] h-[350px] mt-[-95px] mr-[5px] mb-[-100px] object-contain transition-all duration-500 ease-in-out animate-[c-fade-in,c-slide-in-y]"
              sideOffset={60}
            >
              Artwork created by{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to="https://x.com/mangoo454"
                className="text-white font-semibold hover:underline hover:decoration-2"
              >
                <span className="text-primary">@</span>
                mangoo454
              </Link>
            </HoverableImage>
          </Desktop>
          <div className="flex flex-col">
            <h4 className="m-0 p-0 text-primary font-bold">
              {Location.pathname}
            </h4>
            <TypeAnimation
              sequence={[code]}
              wrapper="span"
              speed={typeSpeed}
              style={{
                fontSize: "2em",
                display: "inline-block",
                fontWeight: "600",
              }}
              cursor={false}
            />
            {!beginMessageType ? null : (
              <TypeAnimation
                sequence={[message.current]}
                wrapper="span"
                speed={typeSpeed}
                style={{
                  fontSize: "1em",
                  display: "inline-block",
                  fontWeight: "400",
                }}
                cursor={false}
              />
            )}
            <Button asChild className="w-fit mt-4 h-8">
              <Link to="/">GO HOME</Link>
            </Button>
          </div>
        </div>
      </PlainPageContainer>
      <FooterBar />
    </>
  );
}

export default Error;
