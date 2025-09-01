import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import FlipNumbers from "react-flip-numbers";

import { RootState } from "@/store/configure-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Files,
  Cpu,
  Settings,
  Library,
  MessageCircleQuestion,
} from "lucide-react";
import { numberWithCommas } from "@/lib/utils";
import LoadingBarsMirrored from "@/components/custom/loading/loading1";
import Block from "@/components/custom/navigation/block";

function Desktop() {
  const GeneratePage = lazy(() => import("./GeneratePage"));
  const ViewGeneratedPage = lazy(() => import("./ViewGeneratedPage"));
  const ResourcesPage = lazy(() => import("./ResourcesPage"));
  const SettingsPage = lazy(() => import("./SettingsPage"));
  const AdminSupportPage = lazy(() => import("./AdminSupportPage"));

  const Location = useLocation();
  let navigateMode = Location.pathname.split("/home/")[1];

  if (
    navigateMode !== "generate" &&
    navigateMode !== "view-generated" &&
    navigateMode !== "resources" &&
    navigateMode !== "settings" &&
    navigateMode !== "admin-support"
  ) {
    navigateMode = "generate";
  }

  const { username, userId, credits, hasSupportPrivilege } = useSelector(
    (state: RootState) => state.userReducer
  );

  return (
    <>
      {userId == -1 ? (
        <>
          <Block />
          <div className="flex absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-0">
            <LoadingBarsMirrored />
          </div>
        </>
      ) : (
        <>
          <div className="overflow-hidden absolute w-full h-[1200px] pointer-events-none">
            <div className="relative">
              <img
                src="/icons/triangle0.webp"
                className="absolute object-contain pointer-events-none w-[1024px] h-[1024px] right-0 top-0 translate-x-[250px] translate-y-[-200px] transition-all duration-500 ease-in-out animate-[c-fade-in]"
              ></img>
              <img
                src="/icons/triangle1.webp"
                className="absolute object-contain pointer-events-none w-[1024px] h-[1024px] left-0 translate-x-[-250px] translate-y-[400px] transition-all duration-500 ease-in-out animate-[c-fade-in]"
              ></img>
            </div>
          </div>
          <div className="w-full flex justify-center my-16">
            <div className="w-[60%] h-[900px] flex flex-col">
              <div className="p-6 flex-none bg-[--ontop-background] backdrop-blur rounded-lg rounded-b-none mb-3 ring ring-black ring-offset-border ring-offset-2">
                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <h1 className="text-sm font-medium flex items-center gap-2">
                          Available credits:
                          <span className="font-bold">
                            <FlipNumbers
                              width={10}
                              height={15}
                              color="hsl(var(--primary))"
                              background="#ffffff00"
                              duration={2}
                              play
                              numbers={numberWithCommas(credits)}
                            />
                          </span>
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Your account has allocated credits, which may expire.
                        <br />
                        You can buy more credits in our pricing section.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <h1>
                          @<span className="font-semibold">{username}</span>
                        </h1>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        This is your public display name.
                        <br />
                        You can change it in your account settings.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="grow">
                <Tabs
                  defaultValue={navigateMode}
                  className="flex"
                  onValueChange={(tab) => {
                    window.history.replaceState(
                      null,
                      "home-navigation",
                      "/home/" + tab
                    );
                  }}
                >
                  <TabsList className="bg-[--ontop-background] backdrop-blur rounded-bl-lg rounded-tr-none rounded-tl-none rounded-br-none flex flex-col justify-start py-2 h-auto mr-3">
                    <TabsTrigger
                      className="text-white data-[state=active]:bg-primary data-[state=active]:text-black w-full justify-start m-1"
                      value="generate"
                    >
                      <Cpu />
                      <span className="ml-2">Create content</span>
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-white data-[state=active]:bg-primary data-[state=active]:text-black w-full justify-start m-1"
                      value="view-generated"
                    >
                      <Files />
                      <span className="ml-2">Content</span>
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-white data-[state=active]:bg-primary data-[state=active]:text-black w-full justify-start m-1"
                      value="resources"
                    >
                      <Library />
                      <span className="ml-2">Resources</span>
                    </TabsTrigger>
                    <TabsTrigger
                      className="text-white data-[state=active]:bg-primary data-[state=active]:text-black w-full justify-start m-1"
                      value="settings"
                    >
                      <Settings />
                      <span className="ml-2">Settings</span>
                    </TabsTrigger>
                    {hasSupportPrivilege && (
                      <TabsTrigger
                        className="text-white data-[state=active]:bg-primary data-[state=active]:text-black w-full justify-start m-1"
                        value="admin-support"
                      >
                        <MessageCircleQuestion />
                        <span className="ml-2">Admin Support</span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <TabsContent
                    value="generate"
                    className="relative w-full bg-[--ontop-background] backdrop-blur rounded-br-lg mt-0 p-4 h-[900px] ring ring-black ring-offset-border ring-offset-2"
                  >
                    <Suspense>
                      <GeneratePage isMobile={false} />
                    </Suspense>
                  </TabsContent>
                  <TabsContent
                    value="view-generated"
                    className="relative w-full bg-[--ontop-background] backdrop-blur rounded-br-lg mt-0 p-4 h-[900px] ring ring-black ring-offset-border ring-offset-2"
                  >
                    <Suspense>
                      <ViewGeneratedPage />
                    </Suspense>
                  </TabsContent>
                  <TabsContent
                    value="resources"
                    className="relative w-full bg-[--ontop-background] backdrop-blur rounded-br-lg mt-0 p-4 h-[900px] ring ring-black ring-offset-border ring-offset-2"
                  >
                    <Suspense>
                      <ResourcesPage />
                    </Suspense>
                  </TabsContent>
                  <TabsContent
                    value="settings"
                    className="relative w-full bg-[--ontop-background] backdrop-blur rounded-br-lg mt-0 p-4 h-[900px] ring ring-black ring-offset-border ring-offset-2"
                  >
                    <Suspense>
                      <SettingsPage />
                    </Suspense>
                  </TabsContent>
                  <TabsContent
                    value="admin-support"
                    className="relative w-full bg-[--ontop-background] backdrop-blur rounded-br-lg mt-0 p-4 h-[900px] ring ring-black ring-offset-border ring-offset-2"
                  >
                    <Suspense>
                      <AdminSupportPage />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Desktop;
