import { cn } from "@/lib/utils";
import { HoverRing } from "@/components/ui/hover-ring";
import { Meteors } from "@/components/ui/meteors";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import HoverableImage from "@/components/custom/image/hoverable-image";

const PricingCard = ({
  head = false,
  price,
  price_l,
  header,
  description,
  button_text,
  rewards,
  art_credit_link,
  art_credit_name,
  art_image_path,
}: {
  head?: boolean;
  price: string;
  price_l: string;
  header: string;
  description: string;
  button_text: string;
  rewards: string[];
  art_credit_link: string;
  art_credit_name: string;
  art_image_path: string;
}) => {
  return (
    <HoverRing
      className={cn(
        "w-[325px] h-[650px] bg-black shadow-[0_8px_16px_rgb(0_0_0/0.4)]",
        head && "h-[725px] w-[350px]"
      )}
      innerClassName={cn("", head && "bg-primary")}
      radius={300}
      idleDisabled
    >
      {head ? (
        <div className="w-full h-[195px] relative overflow-hidden">
          <Meteors number={10} height={195} width={350} />
          <HoverableImage
            src={art_image_path}
            alt="icon of login"
            triggerClassName="object-cover w-full h-full bg-black rounded-t-lg"
            className="object-cover w-full h-full bg-black rounded-t-lg"
          >
            Artwork created by{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={art_credit_link}
              className="text-white font-semibold hover:underline hover:decoration-2"
            >
              <span className="text-primary">@</span>
              {art_credit_name}
            </Link>
          </HoverableImage>
        </div>
      ) : (
        <div className="w-full h-[125px] relative overflow-hidden">
          <HoverableImage
            src={art_image_path}
            alt="icon of login"
            triggerClassName="object-cover w-full h-full bg-black rounded-t-lg"
            className="object-cover w-full h-full bg-black rounded-t-lg"
          >
            Artwork created by{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={art_credit_link}
              className="text-white font-semibold hover:underline hover:decoration-2"
            >
              <span className="text-primary">@</span>
              {art_credit_name}
            </Link>
          </HoverableImage>
        </div>
      )}
      <div
        className={cn(
          "w-full h-[100px] bg-[rgb(30_25_6)] flex flex-col items-center justify-center",
          head && "bg-primary text-black"
        )}
      >
        <h2 className={cn("font-medium text-xl", head && "text-3xl")}>
          {header}
        </h2>
        <h3 className="text-sm">{description}</h3>
      </div>
      <div
        className={cn(
          "w-full h-[80px] flex items-center justify-center",
          head && "text-black"
        )}
      >
        <div className="flex items-end">
          <h1 className={cn("text-4xl font-medium", head && "text-5xl")}>
            {price}
          </h1>
          <h2>{price_l}</h2>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <Button variant={"outline"} className="p-6 w-[70%]">
          {button_text}
        </Button>
      </div>
      <Separator className="w-[85%] mx-auto my-8" />
      <ul className="w-[70%] mx-auto">
        {rewards.map((value, index) => {
          return (
            <li
              key={index}
              className={cn("flex font-thin", head ? "text-black" : "text-sm")}
            >
              <span className="mr-2">{head ? <CheckCheck /> : <Check />}</span>
              {value}
            </li>
          );
        })}
      </ul>
    </HoverRing>
  );
};

function DesktopContent() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="flex flex-row justify-center gap-4 items-end w-full mt-[70px]">
        <PricingCard
          header="TASTER"
          description="for getting started"
          price="FREE"
          price_l="/when you verify"
          button_text="GET STARTED"
          rewards={[
            "4 credits",
            "Expires 2 weeks after purchase",
            "Access to our AI assistant",
            "Access to learning resources",
          ]}
          art_credit_link="https://x.com/mangoo454"
          art_image_path="/images/pricing/pricing_c.webp"
          art_credit_name="mangoo454"
        />
        <PricingCard
          head
          header="RAPID LEARNER"
          description="our best deal for you"
          price="£3.99"
          price_l="/once"
          button_text="PURCHASE"
          rewards={[
            "50 credits",
            "Expires 6 weeks after purchase",
            "Access to our AI assistant",
            "Access to learning resources",
          ]}
          art_credit_link="https://x.com/mangoo454"
          art_image_path="/images/pricing/pricing_b.webp"
          art_credit_name="mangoo454"
        />
        <PricingCard
          header="STUDENT"
          description="learn at your own pace"
          price="90p"
          price_l="/once"
          button_text="PURCHASE"
          rewards={[
            "12 credits",
            "Expires 4 weeks after purchase",
            "Access to our AI assistant",
            "Access to learning resources",
          ]}
          art_credit_link="https://x.com/mangoo454"
          art_image_path="/images/pricing/pricing_a.webp"
          art_credit_name="mangoo454"
        />
      </div>
    </div>
  );
}

export default DesktopContent;
