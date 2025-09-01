import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Play, Dot, Highlighter, Bot, NotebookText } from "lucide-react";
import { cn } from "@/lib/utils";

import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/button";
import { HoverRing } from "@/components/ui/hover-ring";
import InView from "@/components/ui/in-view";
import Carousel from "@/components/custom/carousel/Carousel";
import LazyLoadedVideo from "@/components/ui/lazy-video";

const LandingText = ["time", "revision", "learning", "education", "money"];
const CarouselCards = [
  {
    image: "/images/carouseldemo/demo0.webp",
  },
  {
    image: "/images/carouseldemo/demo1.webp",
  },
  {
    image: "/images/carouseldemo/demo2.webp",
  },
  {
    image: "/images/carouseldemo/demo3.webp",
  },
  {
    image: "/images/carouseldemo/demo0.webp",
  },
  {
    image: "/images/carouseldemo/demo1.webp",
  },
  {
    image: "/images/carouseldemo/demo2.webp",
  },
  {
    image: "/images/carouseldemo/demo3.webp",
  },
];

function NoSessionDesktopContent() {
  return (
    <>
      <div className="flex flex-col min-h-[80vh]">
        <div className="flex flex-col flex-1 justify-center">
          <div className="flex items-center flex-col gap-10">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold mr-[0.5rem]">
                Make the best out of your{" "}
              </h1>
              <FlipWords words={LandingText} className="text-5xl font-bold" />{" "}
              <br />
              <h1 className="text-5xl font-bold">.</h1>
            </div>
            <div className="flex items-center flex-col gap-4">
              <div className="flex gap-2">
                <Button asChild variant="default" className="p-6">
                  <Link to="/auth/login" className="font-bold text-lg">
                    Get started
                  </Link>
                </Button>
                <Button asChild variant="outline" className="p-6">
                  <Link to="/" className="font-bold text-lg">
                    <span className="mr-1">
                      <Play className="w-[1.25rem]" />
                    </span>
                    Watch a demo
                  </Link>
                </Button>
              </div>
              <h2 className="font-light italic opacity-80 text-base w-[18rem]">
                Sign up and verify your email for free credits. No credit card
                required.
              </h2>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Carousel className="w-full">
            {CarouselCards.map((cardData, index) => {
              return (
                <div key={index} className="w-[250px] h-[350px] mx-4">
                  <img
                    src={cardData.image}
                    alt=""
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
      <div className="flex flex-col min-h-[100vh] bg-black mt-[15vh] relative px-[20rem] py-[12rem]">
        <div className="absolute top-[-30px] left-0 h-[30px] w-full bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-[-30px] left-0 h-[30px] w-full bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10"></div>
        <div className="mb-32">
          <Tag label="Why choose rapidl" />
          <h2 className="text-white text-3xl mb-8">
            An easier way to learn independantly
          </h2>
          <p className="text-white">
            Create questions tailored to your needs and consult our AI assistant
            for any assistance.
            <br />
            Plus, you'll gain access to numerous free resources upon signing up.
          </p>
        </div>
        <div className="flex flex-row justify-between mb-44">
          <PlainCard
            icon={<NotebookText width={"4rem"} height={"4rem"} />}
            title="Custom Exam Questions"
            desc="Generate personalised exam-style questions tailored to various subjects."
          />
          <PlainCard
            icon={<Highlighter width={"4rem"} height={"4rem"} />}
            title="Quick Marking & Feedback"
            desc="Receive fast marking and feedback on your answers, powered by AI."
          />
          <PlainCard
            icon={<Bot width={"4rem"} height={"4rem"} />}
            title="AI Assistant"
            desc="Consult our AI assistant for instant help with any questions or topics."
          />
        </div>
        <div>
          <div className="flex mb-28">
            <HoverRing className="w-[402px] min-w-[402px] h-[560px] min-h-[560px] mr-[2rem]">
              <LazyLoadedVideo src="/videos/demo/demovideo0.mp4" />
            </HoverRing>
            <div className="p-12">
              <Tag label="Pick your favourites" />
              <h2 className="text-white text-3xl mb-8">
                With just a few clicks
              </h2>
              <p className="text-white">
                We offer a wide range of subjects, each with numerous topics to
                choose from. You can select up to four different topics, and we
                will generate content for you.
              </p>
            </div>
          </div>
          <div className="flex mb-12">
            <div className="p-12">
              <Tag label="Made for you" />
              <h2 className="text-white text-3xl mb-8">
                A library of your personalised content
              </h2>
              <p className="text-white">
                Quick and simple, these are generated based on your selected
                topics. Feel free to rename them or share with your friends.
              </p>
            </div>
            <HoverRing className="w-[402px] min-w-[402px] h-[560px] min-h-[560px] mr-[2rem]">
              <InView>
                <img
                  src="/images/carouseldemo/demo1.webp"
                  alt=""
                  className="rounded-lg object-cover w-full h-full"
                />
              </InView>
            </HoverRing>
          </div>
        </div>
      </div>
      <div className="flex flex-col min-h-[45rem] mt-[300px] relative justify-center items-center overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none -z-10 flex flex-col justify-center items-center">
          <img
            src="/icons/triangle0.webp"
            className="blur-[2px] object-contain w-[900px] h-[900px] transition-all duration-500 ease-in-out animate-[c-fade-in]"
          ></img>
        </div>
        <h1 className="text-5xl font-bold text-primary mb-2">
          So what are you waiting for?
        </h1>
        <h2 className="text-xl font-bold mb-6">
          Get <span className="text-primary">free credits</span> when you sign
          up and verify your email down below.
        </h2>
        <Button asChild variant="default" className="p-6">
          <Link to="/auth/login" className="font-bold text-lg">
            Get started
          </Link>
        </Button>
      </div>
    </>
  );
}

const Tag = ({ label, className }: { label: string; className?: string }) => {
  return (
    <h3
      className={cn(
        "flex text-black bg-primary w-min whitespace-nowrap p-2 rounded-full pr-4 mb-4",
        className
      )}
    >
      <span className="inline-block m-0">
        <Dot strokeWidth={4} />
      </span>
      {label}
    </h3>
  );
};

const PlainCard = ({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) => {
  return (
    <div className="w-[30%] text-center flex flex-col items-center">
      {icon}
      <h2 className="font-semibold text-lg text-primary mt-4 mb-6">{title}</h2>
      <p>{desc}</p>
    </div>
  );
};

export default NoSessionDesktopContent;
