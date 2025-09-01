import {
  useEffect,
  useCallback,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "framer-motion";
import { cn, formatUTCDateTime, getUTCString } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  ExternalLink,
  MessageCircleOff,
  MessagesSquare,
  MessageSquareDot,
} from "lucide-react";
import { backOff } from "exponential-backoff";
import { string, minLength, maxLength, object, Output } from "valibot";
import axios from "axios";

import { trimString } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/configure-store";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const messageSchema: any = object({
  message: string([
    minLength(20, "Message is too short"),
    maxLength(500, "Message is too long"),
  ]),
});

type TicketStatus = "Claimed" | "Unclaimed" | "Closed";
type Ticket = {
  ticketId: number;
  ticketName: string;
  ticketWAU: "Student" | "Teacher" | "Company" | "Organisation" | "Unknown";
  ticketEmail: string;
  ticketShortMessage: string;
  ticketClaimedBy: string;
  ticketStatus: TicketStatus;
  ticketLastChanged: string;
  ticketOpenedAt: string;
};
type FullTicketMessage = {
  messageId: number;
  message: string;
  isTeam: boolean;
  createdAt: string;
};
type FullTicket = {
  ticketId: number;
  ticketName: string;
  ticketWAU: "Student" | "Teacher" | "Company" | "Organisation" | "Unknown";
  ticketEmail: string;
  ticketClaimedBy: number | null;
  ticketClaimedByName: string | null;
  ticketStatus: "Unclaimed" | "Claimed" | "Closed";
  ticketLastChanged: string;
  ticketOpenedAt: string;
  ticketMessages: FullTicketMessage[];
};

function AdminSupportPage() {
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [tab, setTab] = useState("ticket-listing");

  const { hasSupportPrivilege } = useSelector(
    (state: RootState) => state.userReducer
  );

  const openTicket = useCallback((ticketId: string) => {
    setSelectedTicketId(ticketId);
    setTab("ticket-controller");
  }, []);

  return !hasSupportPrivilege ? (
    <>
      <h1>Oops!</h1>
      <p>You do not have access to this resource</p>
    </>
  ) : (
    <Tabs
      defaultValue="ticket-listing"
      className="flex flex-col"
      style={{
        height: "calc(100% - 3rem)",
      }}
      value={tab}
      onValueChange={(v) => {
        setTab(v);
      }}
    >
      <TabsList className="w-full justify-evenly ring-offset-0 ring-1 ring-secondary">
        <TabsTrigger
          className="text-white w-full data-[state=active]:bg-primary data-[state=active]:text-black"
          value="ticket-listing"
        >
          Tickets
        </TabsTrigger>
        <TabsTrigger
          className="text-white w-full data-[state=active]:bg-primary data-[state=active]:text-black"
          value="ticket-controller"
        >
          Admin
        </TabsTrigger>
      </TabsList>
      {tab == "ticket-listing" && (
        <TabsContent value="ticket-listing" className="relative p-1">
          <TicketListing openTicket={openTicket} />
        </TabsContent>
      )}
      {tab == "ticket-controller" && (
        <TabsContent
          value="ticket-controller"
          className="relative p-1 h-full max-h-full"
        >
          <TicketController
            ticketId={selectedTicketId}
            setTab={setTab}
            setTicketId={setSelectedTicketId}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}

function TicketController({
  ticketId,
  setTab,
  setTicketId,
}: {
  ticketId: string;
  setTab: Dispatch<SetStateAction<string>>;
  setTicketId: Dispatch<SetStateAction<string>>;
}) {
  const { userId, username } = useSelector(
    (state: RootState) => state.userReducer
  );
  const [ticket, setTicket] = useState<null | FullTicket>(null);
  const [working, setWorking] = useState(true);
  const [selectedMessageBox, setSelectedMessageBox] = useState(false);
  const bottomLI = useRef<null | HTMLLIElement>(null);

  const messageForm = useForm<Output<typeof messageSchema>>({
    resolver: valibotResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const loadTicket = useCallback(() => {
    setWorking(true);
    backOff(
      () => {
        return axios.get(`/admin/support/ticket?ticketId=${ticketId}`);
      },
      {
        maxDelay: 5000,
        numOfAttempts: 4,
        startingDelay: 300,
      }
    )
      .then((response) => {
        setWorking(false);
        setTicket(response.data);
      })
      .catch((err) => {
        setWorking(false);
        console.error(err);
        toast.error("Could not load ticket");
        setTab("ticket-listing");
      });
  }, []);
  const onMessageSubmit = useCallback(
    (values: Output<typeof messageSchema>) => {
      if (!ticket) {
        return;
      }
      if (working) {
        return;
      }
      setWorking(true);

      axios
        .post("/admin/support/ticket/message", {
          ticketId: Number(ticketId),
          message: values.message,
        })
        .then((_response) => {
          /* locally add message */
          let nextMessageId = 1;
          ticket.ticketMessages.forEach((message) => {
            nextMessageId = Math.max(nextMessageId, message.messageId);
          });
          nextMessageId += 1;

          const utc = getUTCString();
          setTicket({
            ...ticket,
            ticketLastChanged: utc,
            ticketMessages: [
              ...ticket.ticketMessages,
              {
                messageId: nextMessageId,
                isTeam: true,
                message: values.message,
                createdAt: utc,
              },
            ],
          });

          setWorking(false);
        })
        .catch((error) => {
          setWorking(false);
          if (error.response) {
            toast.error(`${error.response.status}: ${error.response.data}`);
          }
        });
    },
    [working, ticket]
  );

  const deleteTicket = useCallback(() => {
    if (working) {
      return;
    }
    if (!ticket) {
      return;
    }
    setWorking(true);

    axios
      .delete(`/admin/support/ticket?ticketId=${ticketId}`)
      .then((response) => {
        if (response.status == 200) {
          setTicket(null);
        }
        setWorking(false);
        setTicketId("");
      })
      .catch((error) => {
        setWorking(false);
        if (error.response) {
          toast.error(`${error.response.data}`);
        }
      });
  }, [working, ticket]);

  const changeTicketState = useCallback(
    (requestState: "Claim" | "Unclaim" | "Close") => {
      if (working) {
        return;
      }
      if (!ticket) {
        return;
      }
      const newState = {
        Claim: "Claimed",
        Unclaim: "Unclaimed",
        Close: "Closed",
      }[requestState] as TicketStatus;
      if (newState == ticket.ticketStatus) {
        return;
      }
      setWorking(true);

      axios
        .put(`/admin/support/ticket?ticketId=${ticketId}&mode=${requestState}`)
        .then((response) => {
          if (response.status == 200) {
            const utc = getUTCString();
            if (requestState != "Unclaim") {
              setTicket({
                ...ticket,
                ticketStatus: newState,
                ticketLastChanged: utc,
                ticketClaimedBy: userId,
                ticketClaimedByName: username,
              });
            } else {
              setTicket({
                ...ticket,
                ticketStatus: newState,
                ticketLastChanged: utc,
                ticketClaimedBy: null,
                ticketClaimedByName: null,
              });
            }
          }
          setWorking(false);
        })
        .catch((error) => {
          setWorking(false);
          if (error.response) {
            toast.error(`${error.response.data}`);
          }
        });
    },
    [working, ticket]
  );

  const scrollToBottom = useCallback(() => {
    if (bottomLI.current) {
      bottomLI.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [ticket]);

  useEffect(() => {
    loadTicket();
    scrollToBottom();
  }, []);

  return ticketId == "" ? (
    <div className="relative w-full mt-5">
      <div className="w-[80%] mx-auto">
        <h1 className="text-lg">There is nothing to see here.</h1>
        <p className="text-sm mb-4">
          You must select a ticket from the tickets tab.
        </p>
        <Button variant="default" onClick={() => setTab("ticket-listing")}>
          Go to tickets
        </Button>
      </div>
    </div>
  ) : (
    <div className="relative flex flex-col h-full p-4">
      {ticket && (
        <div className="relative w-full mb-4">
          <div className="w-full flex justify-between text-sm">
            <div>
              <p className="text-primary text-lg">
                Ticket {`#${ticket.ticketId}`}
              </p>
              <p>Issuer: {ticket.ticketName}</p>{" "}
            </div>
            <div className="flex flex-col items-end">
              <TicketBadge ticketWAU={ticket.ticketWAU} className="" />
              <p>
                Created on{" "}
                {(() => {
                  const [date, time] = formatUTCDateTime(ticket.ticketOpenedAt);
                  return `${date} at ${time}`;
                })()}
              </p>
              <p>
                Last changed on{" "}
                {(() => {
                  const [date, time] = formatUTCDateTime(
                    ticket.ticketLastChanged
                  );
                  return `${date} at ${time}`;
                })()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {ticket.ticketClaimedByName && (
              <p className="text-sm italic">
                {ticket.ticketStatus} by{" "}
                <span className="text-primary">
                  {ticket.ticketClaimedByName}
                </span>
              </p>
            )}
            {ticket.ticketStatus == "Closed" &&
              ticket.ticketClaimedBy == userId && (
                <Button
                  variant="destructive"
                  className="p-2 h-8"
                  disabled={working}
                  onClick={() => deleteTicket()}
                >
                  Delete Ticket
                </Button>
              )}
            {ticket.ticketStatus != "Closed" &&
              (ticket.ticketClaimedBy == userId ? (
                <>
                  <Button
                    variant="secondary"
                    className="p-2 h-8"
                    disabled={working}
                    onClick={() => changeTicketState("Unclaim")}
                  >
                    Unclaim Ticket
                  </Button>
                  <Button
                    variant="destructive"
                    className="p-2 h-8"
                    disabled={working}
                    onClick={() => changeTicketState("Close")}
                  >
                    Close ticket
                  </Button>
                </>
              ) : (
                ticket.ticketStatus == "Unclaimed" && (
                  <Button
                    variant="default"
                    className="p-2 h-8"
                    disabled={working}
                    onClick={() => changeTicketState("Claim")}
                  >
                    Claim Ticket
                  </Button>
                )
              ))}
          </div>
          <Separator className="mt-4" />
        </div>
      )}
      <div className="flex-1 mb-4 overflow-y-auto">
        <ul className="flex flex-col">
          {ticket &&
            ticket.ticketMessages.map((ticketMessage, index) => {
              const nextTicketMessage = ticket.ticketMessages[index + 1];
              if (
                nextTicketMessage == null ||
                nextTicketMessage.isTeam != ticketMessage.isTeam
              ) {
                return (
                  <motion.li
                    key={ticketMessage.messageId}
                    initial={{
                      opacity: 0,
                      x: !ticketMessage.isTeam ? -150 : 150,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`bubble ${
                      !ticketMessage.isTeam
                        ? "bubble-me bg-primary mb-4"
                        : "bubble-other bg-secondary mb-4"
                    } text-sm max-w-[70%]`}
                  >
                    {ticketMessage.message}
                  </motion.li>
                );
              } else {
                return (
                  <motion.li
                    key={ticketMessage.messageId}
                    initial={{
                      opacity: 0,
                      x: !ticketMessage.isTeam ? -150 : 150,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`bubble-no-tail ${
                      !ticketMessage.isTeam
                        ? "bubble-no-tail-me bg-primary mb-1"
                        : "bubble-no-tail-other bg-secondary mb-1"
                    } text-sm max-w-[70%]`}
                  >
                    {ticketMessage.message}
                  </motion.li>
                );
              }
            })}
          <li className="clear-both float-left" ref={bottomLI}></li>
        </ul>
      </div>
      {ticket?.ticketStatus == "Claimed" &&
        ticket.ticketClaimedBy == userId && (
          <div className="relative w-full p-2">
            <div className="p-4 bg-secondary/25 w-full relative rounded-[1.15rem] shadow-[0px_2px_3px_-1px_rgba(255,255,255,0.1),_0px_1px_0px_0px_rgba(255,255,255,0.1),_0px_0px_0px_1px_rgba(255,255,255,0.08)]">
              <Form {...messageForm}>
                <form
                  onSubmit={messageForm.handleSubmit(onMessageSubmit)}
                  className="w-full"
                >
                  <FormField
                    control={messageForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                        <FormControl
                          onFocus={() => setSelectedMessageBox(true)}
                          onBlur={() => setSelectedMessageBox(false)}
                        >
                          <AutosizeTextarea
                            disabled={working}
                            maxHeight={200}
                            minHeight={0}
                            placeholder="Type a response"
                            {...field}
                            className="resize-none min-h-0 bg-transparent ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none border-none focus-visible:ring-offset-0 p-0 w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <button
                    disabled={working}
                    type="submit"
                    className={cn(
                      "absolute right-2 -bottom-1 z-50 -translate-y-1/2 h-8 w-8 rounded-full bg-zinc-900 disabled:bg-zinc-800 transition duration-200 flex items-center justify-center",
                      selectedMessageBox && "b bg-stone-600"
                    )}
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300 h-4 w-4"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <motion.path
                        d="M5 12l14 0"
                        initial={{
                          strokeDasharray: "50%",
                          strokeDashoffset: "50%",
                        }}
                        animate={{
                          strokeDashoffset: selectedMessageBox ? 0 : "50%",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "linear",
                        }}
                      />
                      <path d="M13 18l6 -6" />
                      <path d="M13 6l6 6" />
                    </motion.svg>
                  </button>
                </form>
              </Form>
            </div>
          </div>
        )}
    </div>
  );
}

function TicketStatus({
  ticket,
  className,
}: {
  ticket: Ticket;
  className: string;
}) {
  switch (ticket.ticketStatus) {
    case "Unclaimed":
      return (
        <div
          className={cn(
            "relative flex flex-row items-center text-green-500",
            className
          )}
        >
          <MessageSquareDot className="mr-1 flex-shrink-0" />
        </div>
      );
    case "Claimed":
      return (
        <div
          className={cn(
            "relative flex flex-row items-center text-orange-500",
            className
          )}
        >
          <MessagesSquare className="mr-1 flex-shrink-0" />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {ticket.ticketClaimedBy}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ticket claimed by {ticket.ticketClaimedBy}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    case "Closed":
      return (
        <div
          className={cn(
            "relative flex flex-row items-center text-red-500",
            className
          )}
        >
          <MessageCircleOff className="mr-1 flex-shrink-0" />
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                {ticket.ticketClaimedBy}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ticket closed by {ticket.ticketClaimedBy}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
  }
}

function TicketBadge({
  ticketWAU,
  className,
}: {
  ticketWAU: string;
  className: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "justify-center font-thin " +
          (() => {
            switch (ticketWAU) {
              case "Student":
                return "border-primary";
              case "Teacher":
                return "border-blue-600";
              case "Company":
                return "border-red-600";
              case "Organisation":
                return "border-purple-600";
              default:
                return "";
            }
          })(),
        className
      )}
    >
      {ticketWAU}
    </Badge>
  );
}

function Ticket({
  ticket,
  keyAppend,
  onClick,
}: {
  ticket: Ticket;
  keyAppend: string;
  onClick: () => void;
}) {
  return (
    <li key={ticket.ticketId + keyAppend}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent w-full h-10 flex flex-row items-center justify-between"
              onClick={onClick}
            >
              <div className="relative w-[96%] max-w-[100%] flex flex-row justify-start items-center gap-3">
                {/* So, for some reason "overflow" is still 
                  calculated *before* render and it makes 
                  the parent elements grow. trimString is 
                  hardcoded here to ensure the strings are 
                  at acceptable length, but you will see 
                  the elements grow once you zoom in. */}
                <TicketStatus ticket={ticket} className="w-[10%]" />
                <TicketBadge ticketWAU={ticket.ticketWAU} className="w-[14%]" />
                <p className="text-left w-[16%] overflow-ellipsis whitespace-nowrap overflow-hidden font-thin">
                  {trimString(ticket.ticketName, 18)}
                </p>
                <p className="text-left w-[20%] overflow-ellipsis whitespace-nowrap overflow-hidden font-thin">
                  {trimString(ticket.ticketEmail, 19)}
                </p>
                <p className="text-left w-[25%] overflow-ellipsis whitespace-nowrap overflow-hidden font-thin">
                  {trimString(ticket.ticketShortMessage, 31)}
                </p>
              </div>
              <ExternalLink className="text-sm" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Ticket created on{" "}
              {(() => {
                const [date, time] = formatUTCDateTime(ticket.ticketOpenedAt);
                return `${date} at ${time}`;
              })()}{" "}
              and last changed on{" "}
              {(() => {
                const [date, time] = formatUTCDateTime(
                  ticket.ticketLastChanged
                );
                return `${date} at ${time}`;
              })()}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}

function TicketListing({
  openTicket,
}: {
  openTicket: (ticketId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [allPage, setAllPage] = useState<Ticket[]>([]);
  const [claimedPage, setUnclaimedPage] = useState<Ticket[]>([]);
  const [allPageSize, setAllPageSize] = useState(0);
  const [claimedPageSize, setUnclaimedPageSize] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [allPagePointer, _setAllPagePointer] = useState(0);
  const [claimedPagePointer, _setUnclaimedPagePointer] = useState(0);
  const [filterByName, setFilterByName] = useState("");

  const loadPage = useCallback(
    (
      page: number, // 0 indexed, + 1 when requesting
      all: boolean
    ) => {
      if (loading) {
        return;
      }
      if (all && page > allPageSize) {
        return;
      }
      if (!all && page > claimedPageSize) {
        return;
      }
      setLoading(true);

      let shouldGetTotalPages = false;
      if (all && page == 0 && allPageSize <= 1) {
        shouldGetTotalPages = true;
      } else if (all && page == allPageSize - 1) {
        shouldGetTotalPages = true;
      } else if (!all && page == 0 && claimedPageSize <= 1) {
        shouldGetTotalPages = true;
      } else if (!all && page == claimedPageSize - 1) {
        shouldGetTotalPages = true;
      }

      backOff(
        () => {
          return axios.get(
            `/admin/support/list-ticket?page=${
              page + 1
            }&get_claimed_only=${!all}&get_total_pages=${shouldGetTotalPages}`
          );
        },
        {
          maxDelay: 5000,
          numOfAttempts: 4,
          startingDelay: 300,
        }
      )
        .then((response) => {
          if (all) {
            setAllPage(response.data.content);
            if (response.data.total_pages) {
              setAllPageSize(response.data.total_pages);
            }
          } else {
            setUnclaimedPage(response.data.content);
            if (response.data.total_pages) {
              setUnclaimedPageSize(response.data.total_pages);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    },
    [loading, claimedPageSize, allPageSize]
  );

  useEffect(() => {
    loadPage(0, false);
  }, []);

  useEffect(() => {
    if (viewAll) {
      loadPage(allPagePointer, true);
    } else {
      loadPage(claimedPagePointer, false);
    }
  }, [viewAll, allPagePointer, claimedPagePointer]);

  return (
    <>
      <div className="flex justify-between mt-6 mb-4">
        <Input
          placeholder="Filter by ticket name"
          className="max-w-sm bg-transparent"
          onChange={(event) => {
            setFilterByName(event.target.value);
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm ring-secondary ring-1 p-2 rounded-sm">
            {viewAll ? "Viewing all tickets" : "Viewing claimed tickets"}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                if (loading) {
                  return;
                }
                setViewAll(true);
              }}
            >
              All tickets
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (loading) {
                  return;
                }
                setViewAll(false);
              }}
            >
              Claimed tickets
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => {
                return <Skeleton className="h-10 w-full" key={index} />;
              })
            : viewAll
            ? allPage
                .filter((ticket) => {
                  if (filterByName == "") {
                    return true;
                  }
                  return ticket.ticketName
                    .toLowerCase()
                    .includes(filterByName.toLowerCase());
                })
                .map((ticket, index) => (
                  <Ticket
                    ticket={ticket}
                    keyAppend="-all"
                    key={index}
                    onClick={() => {
                      openTicket(String(ticket.ticketId));
                    }}
                  />
                ))
            : claimedPage
                .filter((ticket) => {
                  if (filterByName == "") {
                    return true;
                  }
                  return ticket.ticketName
                    .toLowerCase()
                    .includes(filterByName.toLowerCase());
                })
                .map((ticket, index) => (
                  <Ticket
                    ticket={ticket}
                    keyAppend="-claimed"
                    key={index}
                    onClick={() => {
                      openTicket(String(ticket.ticketId));
                    }}
                  />
                ))}
        </ul>
      </div>
    </>
  );
}

export default AdminSupportPage;
