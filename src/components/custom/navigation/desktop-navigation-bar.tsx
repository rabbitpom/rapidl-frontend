import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

import styles from "./navigation-bar.module.css";

import { RootState } from "@/store/configure-store";
import NavigationRoot from "../dropdown/NavigationRoot";
import NavigationDropdown from "../dropdown/NavigationDropDown";
import NavigationButton from "../dropdown/NavigationButton";
import NavigationLink from "../dropdown/NavigationLink";
import Title from "./title";

function DesktopNavigationBar() {
  const Working = useRef(false);
  const NavigateTo = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [scrollThresholdReached, setScrollThresholdReached] = useState(false);
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );

  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setScrollThresholdReached(scrollY > rootFontSize * 3);
      setScrollY(scrollY);
    };
    window.addEventListener("scroll", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);
  return (
    <div className="z-50 relative w-full h-32">
      <NavigationRoot>
        <div
          className={cn(
            `${styles["light-navi-bar"]} dark:${styles["dark-navi-bar"]} w-fit m-auto p-6 rounded-lg backdrop-blur mt-12 fixed top-0 left-0 right-0`,
            `${scrollThresholdReached && "mt-0 p-5 rounded-none rounded-b-2xl"}`
          )}
          style={{
            transform: scrollThresholdReached
              ? ""
              : `translate(0,-${scrollY}px)`,
          }}
        >
          <div className="flex items-center">
            <div className="flex items-center pointer-events-none">
              <img
                className={`size-8`}
                src="/company/logo.svg"
                alt="Logo of company"
              />
              <h1 className="font-bold text-xl pl-2">rapidl</h1>
            </div>
            <div className="flex items-center">
              <NavigationButton
                text="HOME"
                className="mx-0.5 ml-6 py-1"
                to="/home"
              ></NavigationButton>
              <NavigationButton text="PRICING" className="mx-0.5 py-1">
                <Title>Store</Title>
                <NavigationLink href="/pricing" caret={true}>
                  Purchase credits
                </NavigationLink>
                <Title>Unlimited credits?!</Title>
                <NavigationLink href="/support/contact" caret={true}>
                  Seal the deal
                </NavigationLink>
              </NavigationButton>
              <NavigationButton text="HELP" className="mx-0.5 py-1">
                <Title>Got any questions?</Title>
                <NavigationLink href="/support/questions" caret={true}>
                  Commonly asked questions
                </NavigationLink>
                <Title>Require further help?</Title>
                <NavigationLink href="/support/contact" caret={true}>
                  Contact Us
                </NavigationLink>
              </NavigationButton>
              <NavigationButton text="POLICIES" className="mx-0.5 py-1">
                <Title>Legal shenanigans</Title>
                <NavigationLink href="/policy/termsofservice" caret={true}>
                  Terms of Service
                </NavigationLink>
                <NavigationLink href="/policy/privacy" caret={true}>
                  Privacy Policy
                </NavigationLink>
                <NavigationLink href="/policy/cookie" caret={true}>
                  Cookie Policy
                </NavigationLink>
                <NavigationLink href="/policy/refund" caret={true}>
                  Refund Policy
                </NavigationLink>
              </NavigationButton>
              {sessionEnded ? (
                <>
                  <Button asChild variant="default" className="h-8 mr-1 ml-1">
                    <Link to="/auth/login">LOGIN</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-8">
                    <Link to="/auth/sign-up">SIGN UP</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    className="h-8 mr-1 ml-1"
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
            <NavigationDropdown offsetY="-15px" className="text-sm" />
          </div>
        </div>
      </NavigationRoot>
    </div>
  );
}

export default DesktopNavigationBar;
