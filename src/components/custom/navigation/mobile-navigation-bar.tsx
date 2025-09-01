import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import styles from "./navigation-bar.module.css";

import { RootState } from "@/store/configure-store";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Hamburger from "../hamburger/Hamburger";

function DesktopNavigationBar() {
  const Working = useRef(false);
  const NavigateTo = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const expired = useSelector((state: RootState) => state.tokenReducer.expired);

  return (
    <>
      <div className="flex flex-col fixed w-full z-50">
        <div
          className={`${styles["light-navi-bar"]} dark:${styles["dark-navi-bar"]} w-full px-6 py-3 backdrop-blur flex justify-between`}
        >
          <div className="flex items-center pointer-events-none">
            <img
              className={`size-8`}
              src="/company/logo.svg"
              alt="Logo of company"
            />
            <h1 className="font-bold text-xl pl-2">rapidl</h1>
          </div>
          <Hamburger
            strokeWidth="5.5"
            stroke="white"
            size="64px"
            setIsVisible={setIsVisible}
          />
        </div>
        {isVisible && (
          <div
            className={`${styles["light-navi-bar-light"]} dark:${styles["dark-navi-bar-light"]} p-6 pt-0 backdrop-blur-md`}
          >
            <Button
              asChild
              variant="link"
              className="text-base px-0 py-4 mb-1 text-black dark:text-white"
            >
              <Link to="/home">HOME</Link>
            </Button>
            <Accordion type="single" collapsible>
              <AccordionItem value="tab-pricing">
                <AccordionTrigger className="pt-0">PRICING</AccordionTrigger>
                <AccordionContent className="flex flex-col items-start">
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/pricing">Store</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/support/contact">Get unlimited credits</Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tab-help">
                <AccordionTrigger className="pt-0">HELP</AccordionTrigger>
                <AccordionContent className="flex flex-col items-start">
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/support/questions">
                      Commonly asked questions
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/support/contact">Contact us</Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tab-policies">
                <AccordionTrigger className="py-0">POLICIES</AccordionTrigger>
                <AccordionContent className="flex flex-col items-start">
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/policy/termsofservice">Terms of Service</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/policy/privacy">Privacy Policy</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/policy/cookie">Cookie Policy</Link>
                  </Button>
                  <Button
                    asChild
                    variant="link"
                    className="px-0 py-4 mb-1 text-black dark:text-white"
                  >
                    <Link to="/policy/refund">Refund Policy</Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator className="my-4" />
            {expired ? (
              <div className="flex flex-col">
                <Button asChild variant="default" className="h-8 mb-2">
                  <Link to="/auth/login">LOGIN</Link>
                </Button>
                <Button asChild variant="outline" className="h-8">
                  <Link to="/auth/sign-up">SIGN UP</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="destructive"
                  className="h-8 w-full"
                  onClick={() => {
                    if (Working.current) {
                      return;
                    }
                    Working.current = true;
                    axios
                      .post("/sign-out")
                      .then((_) => {
                        toast.success("You are now signed out");
                        Working.current = false;
                        NavigateTo("/", { replace: true });
                      })
                      .catch((_) => {
                        toast.error("Failed to sign you out");
                        Working.current = false;
                      });
                  }}
                >
                  SIGN OUT
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DesktopNavigationBar;
