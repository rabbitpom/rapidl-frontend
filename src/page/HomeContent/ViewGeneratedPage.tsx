import { useEffect, useState, useRef, useCallback } from "react";
import { cn, formatUTCDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";
import Umami from "@/components/Umami";

import { MoreHorizontal } from "lucide-react";
import {
  useTabletAndBelowMediaQuery,
  TabletAndBelow,
  Desktop,
} from "@/components/custom/responsive/device";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingBarsMirrored from "@/components/custom/loading/loading1";

const PAGE_ON_SCREEN_PC = 2;
const PAGE_ON_SCREEN_MOBILE = 1;
const PAGE_SIZE = 10;

const TOOLTIP_STATUS = {
  Working: "Generating your content, please wait",
  Waiting: "Your request was placed in a queue, please wait",
  Failed: "Generation failed, you can try generating again by pressing retry",
  Success: "Generation successful, you can view your content by clicking on it",
};

type CONTENT_PAYLOAD = {
  status: "Working" | "Failed" | "Waiting" | "Success";
  createdat: string;
  finishedon: string | null;
  jobid: string;
  creditsused: number;
  category: string;
  options: string;
  displayname: string;
};

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

function ViewGeneratedPage() {
  const [blockingIntervalReload, setBlockingIntervalReload] = useState(false);
  const [blockingRetry, setBlockingRetry] = useState(false);
  const pageCache = useRef<{ [key: number]: CONTENT_PAYLOAD[] }>({});
  const [pageContent, setPageContent] = useState<null | CONTENT_PAYLOAD[]>(
    null
  );
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const isMobile = useTabletAndBelowMediaQuery();
  const deleteCancelLock = useRef(false);
  const previousPageRef = useRef(-1); // this is used to prevent double reloading... although it reloads the first page twice

  function GetPlainDestructiveDropDownFromStatus(
    status: "Failed" | "Working" | "Waiting" | "Success"
  ) {
    if (status == "Working") {
      return (
        <DropdownMenuItem
          disabled={true} // cant cancel if its working
          className="text-black hover:text-black focus:text-black bg-primary brightness-75 hover:brightness-100 focus:brightness-100 hover:bg-primary focus:bg-primary"
        >
          Cancel
        </DropdownMenuItem>
      );
    }
    if (status == "Failed" || status == "Success") {
      return (
        <DropdownMenuItem className="bg-destructive brightness-75 hover:brightness-100 focus:brightness-100 hover:bg-destructive focus:bg-destructive">
          Delete
        </DropdownMenuItem>
      );
    }
    return (
      <DropdownMenuItem className="text-black hover:text-black focus:text-black bg-primary brightness-75 hover:brightness-100 focus:brightness-100 hover:bg-primary focus:bg-primary">
        Cancel
      </DropdownMenuItem>
    );
  }

  const reloadPage = useCallback((page: number, get_total_pages: boolean) => {
    setLoading(true);
    axios
      .get(
        `/generated/list?page=${
          page + 1
        }&page_size=${PAGE_SIZE}&get_total_pages=${get_total_pages}`
      )
      .then((response) => {
        if (response.data.total_pages != null) {
          setTotalPages(response.data.total_pages);
        }
        pageCache.current[page] = response.data.content;
        setPageContent(response.data.content);
        setLoading(false);
      })
      .catch((_error) => {
        toast.error(`That's weird, we couldn't load page ${page + 1}.`);
        setLoading(false);
      });
  }, []);

  const retryGeneration = useCallback(
    (content: CONTENT_PAYLOAD, page: number) => {
      if (blockingRetry) {
        toast.error(`Please wait a second before retrying.`);
        return;
      }
      setBlockingRetry(true);
      axios
        .post(`/generated/content/retry?id=${content.jobid}`)
        .then((_response) => {
          setBlockingRetry(false);
          // update cache
          let pageContentCache = pageCache.current[page];
          if (pageContentCache == null) {
            return;
          }
          pageContentCache.forEach((item) => {
            if (item.jobid != content.jobid) {
              return;
            }
            item.status = "Waiting";
          });
          setPageContent([...pageContentCache]);

          Umami.logEvent("Retry generated content");
        })
        .catch((_error) => {
          toast.error(
            `That's weird, we couldn't retry '${
              content.displayname.length == 0
                ? content.jobid
                : content.displayname
            }'`
          );
          setBlockingRetry(false);

          Umami.logEvent("Retry generated content failure");
        });
    },
    [blockingRetry]
  );

  const changeGenerationName = useCallback(
    (event: any, content: CONTENT_PAYLOAD, page: number) => {
      const inputValue = event.target.value;
      if (inputValue.length > 20) {
        toast.error(`Name is too long, please shorten it!`);
        return;
      }
      if (inputValue == content.displayname) {
        return;
      }
      axios
        .post(
          `/generated/content?id=${content.jobid}&displayname=${inputValue}`
        )
        .then((_response) => {
          toast.success(`Successfully changed name!`);
          // update cache
          let pageContentCache = pageCache.current[page];
          if (pageContentCache == null) {
            return;
          }
          pageContentCache.forEach((item) => {
            if (item.jobid != content.jobid) {
              return;
            }
            item.displayname = inputValue;
          });
          setPageContent([...pageContentCache]);
        })
        .catch((_error) => {
          toast.error(`That's weird, we couldn't change the name.`);
        });
    },
    []
  );

  const deleteGeneration = useCallback(
    (page: number, jobid: string, displayname: string) => {
      if (deleteCancelLock.current) {
        toast.error(
          `Please wait for the previous delete/cancel operation to finish`
        );
        return;
      }
      deleteCancelLock.current = true;
      axios
        .delete(`/generated/content?id=${jobid}`)
        .then((_response) => {
          toast.success(
            `Successfully deleted '${
              displayname.length == 0 ? jobid : displayname
            }'`
          );
          // clear and rebuild cache
          previousPageRef.current = Math.max(page - 1, 0);
          reloadPage(
            page,
            totalPages == 0 || page == 0 || page == totalPages - 1
          );
          deleteCancelLock.current = false;

          Umami.logEvent("Delete generated content");
        })
        .catch((_error) => {
          toast.error(
            `That's weird, we couldn't delete '${
              displayname.length == 0 ? jobid : displayname
            }'`
          );
          deleteCancelLock.current = false;

          Umami.logEvent("Delete generated content failure");
        });
    },
    [totalPages]
  );

  const cancelGeneration = useCallback(
    (page: number, jobid: string, displayname: string) => {
      if (deleteCancelLock.current) {
        toast.error(
          `Please wait for the previous delete/cancel operation to finish`
        );
        return;
      }
      deleteCancelLock.current = true;
      axios
        .delete(`/generated/content?id=${jobid}`)
        .then((_response) => {
          toast.success(
            `Successfully cancelled '${
              displayname.length == 0 ? jobid : displayname
            }'`
          );
          // clear and rebuild cache
          previousPageRef.current = Math.max(page - 1, 0);
          reloadPage(
            page,
            totalPages == 0 || page == 0 || page == totalPages - 1
          );
          deleteCancelLock.current = false;

          Umami.logEvent("Cancel generated content");
        })
        .catch((_error) => {
          toast.error(
            `That's weird, we couldn't cancel '${
              displayname.length == 0 ? jobid : displayname
            }'`
          );
          deleteCancelLock.current = false;

          Umami.logEvent("Cancel generated content failure");
        });
    },
    [totalPages]
  );

  useEffect(() => {
    if (pageCache.current[page] != null && page < totalPages - 1) {
      previousPageRef.current = page;
      setPageContent(pageCache.current[page]);
      return;
    }
    if (previousPageRef.current == page && previousPageRef.current != 0) {
      return;
    }
    previousPageRef.current = page;
    setPageContent(null);
    const getPageSize = totalPages == 0 || page == 0 || page == totalPages - 1;
    reloadPage(page, getPageSize);
  }, [page, reloadPage, totalPages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (pageContent == null) {
        return;
      }
      if (!blockingIntervalReload) {
        let job_ids_to_update = pageContent
          .filter(
            (content) =>
              content.status === "Waiting" || content.status === "Working"
          )
          .map((content) => content.jobid);
        if (job_ids_to_update.length == 0) {
          return;
        }
        setBlockingIntervalReload(true);
        let batch_ids = job_ids_to_update.join(",");
        axios
          .get(`/generated/content/batch?ids=${batch_ids}`)
          .then((response) => {
            let pageContentCache = pageCache.current[page];
            if (pageContentCache == null) {
              return;
            }
            let changed = false;
            response.data.forEach((content: CONTENT_PAYLOAD) => {
              if (content.status != "Waiting" && content.status != "Working") {
                pageContentCache.forEach((item) => {
                  if (
                    item.jobid.replace(/-/g, "") !=
                    content.jobid.replace(/-/g, "")
                  ) {
                    return;
                  }
                  item.status = content.status;
                  changed = true;
                });
              }
            });
            if (changed) {
              setPageContent([...pageContentCache]);
            }
            setBlockingIntervalReload(false);
          })
          .catch((_error) => {
            console.log(_error);
            setBlockingIntervalReload(false);
          });
      }
    }, 2500);

    return () => {
      clearInterval(intervalId);
    };
  }, [page, pageContent, blockingIntervalReload]);

  return (
    <div>
      {loading ? (
        <div className="flex absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex-col items-center gap-0">
          <LoadingBarsMirrored />
        </div>
      ) : totalPages == 0 ? (
        <div className="h-auto">
          <div className="flex flex-col items-center">
            <div className="flex flex-col">
              <p className="text-white text-center font-bold inline-block mt-32 text-xl">
                Oops!
              </p>
              <p className="text-white text-center font-medium inline-block text-sm">
                There is nothing here. You can generate some by doing to the
                'Generate content' on your left.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <TabletAndBelow>
            <div className="h-auto gap-3 flex flex-col">
              {pageContent &&
                pageContent.map((content, _) => {
                  const [createdDate, createdTime] = formatUTCDateTime(
                    content.createdat
                  );
                  const [finishedDate, finishedTime] = formatUTCDateTime(
                    content.finishedon
                  );
                  return (
                    <div key={content.jobid}>
                      <Button
                        variant="outline"
                        className="w-full h-16 flex flex-row justify-start items-center gap-3"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex-shrink-0 w-[26%]">
                              <p
                                className={cn("text-left font-bold", {
                                  "text-red-500": content.status === "Failed",
                                  "text-green-500":
                                    content.status === "Success",
                                  "text-cyan-500": content.status === "Waiting",
                                  "text-yellow-500":
                                    content.status === "Working",
                                })}
                              >
                                {content.status}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{TOOLTIP_STATUS[content.status]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex-shrink-0 w-[50%]">
                              <Input
                                type="text"
                                placeholder={
                                  content.displayname.length == 0
                                    ? content.jobid
                                    : content.displayname
                                }
                                onBlur={(event) => {
                                  changeGenerationName(event, content, page);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key == "Enter") {
                                    changeGenerationName(event, content, page);
                                  }
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                You can change the name of your generated
                                content here
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="flex justify-end w-full">
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                disabled={content.status != "Success"}
                                asChild
                              >
                                <Link
                                  to={`${HostURL}/generated/content/view/${content.jobid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open in new tab
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="pointer-events-none opacity-100">
                                Created on {createdDate} at {createdTime}
                              </DropdownMenuItem>
                              {finishedDate && finishedTime && (
                                <DropdownMenuItem className="pointer-events-none opacity-100">
                                  Finished on {finishedDate} at {finishedTime}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-primary pointer-events-none opacity-100">{`${
                                content.creditsused
                              } credit${
                                content.creditsused > 1 ? "s" : ""
                              } used`}</DropdownMenuItem>

                              {content.status == "Failed" && (
                                <DropdownMenuItem
                                  className="text-black hover:text-black focus:text-black bg-primary brightness-75 hover:brightness-100 focus:brightness-100 hover:bg-primary focus:bg-primary"
                                  onClick={() => retryGeneration(content, page)}
                                >
                                  Retry
                                </DropdownMenuItem>
                              )}
                              <AlertDialogTrigger asChild>
                                {GetPlainDestructiveDropDownFromStatus(
                                  content.status
                                )}
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete '
                                {content.displayname.length == 0
                                  ? content.jobid
                                  : content.displayname}
                                ' from our servers. You will not be refunded in
                                credits.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (
                                    content.status == "Success" ||
                                    content.status == "Failed"
                                  ) {
                                    deleteGeneration(
                                      page,
                                      content.jobid,
                                      content.displayname
                                    );
                                  } else {
                                    cancelGeneration(
                                      page,
                                      content.jobid,
                                      content.displayname
                                    );
                                  }
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Button>
                    </div>
                  );
                })}
            </div>
          </TabletAndBelow>
          <Desktop>
            <div className="h-auto gap-3 flex flex-col">
              {pageContent &&
                pageContent.map((content, _) => {
                  const [createdDate, createdTime] = formatUTCDateTime(
                    content.createdat
                  );
                  const [finishedDate, finishedTime] = formatUTCDateTime(
                    content.finishedon
                  );
                  return (
                    <div key={content.jobid}>
                      <Button
                        variant="outline"
                        className="w-full h-16 flex flex-row justify-start items-center gap-3"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex-shrink-0 w-[8%]">
                              <p
                                className={cn("text-left font-bold", {
                                  "text-red-500": content.status === "Failed",
                                  "text-green-500":
                                    content.status === "Success",
                                  "text-cyan-500": content.status === "Waiting",
                                  "text-yellow-500":
                                    content.status === "Working",
                                })}
                              >
                                {content.status}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{TOOLTIP_STATUS[content.status]}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex-shrink-0 w-[20%]">
                              <Input
                                type="text"
                                placeholder={
                                  content.displayname.length == 0
                                    ? content.jobid
                                    : content.displayname
                                }
                                onBlur={(event) => {
                                  changeGenerationName(event, content, page);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key == "Enter") {
                                    changeGenerationName(event, content, page);
                                  }
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                You can change the name of your generated
                                content here
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex-shrink-0 w-[18%]">
                              <ul className="gap-1 flex flex-col font-light opacity-75">
                                <li>
                                  <p>
                                    {createdDate} {createdTime}
                                  </p>
                                </li>
                                {finishedDate && finishedTime && (
                                  <li>
                                    <p>
                                      {finishedDate} {finishedTime}
                                    </p>
                                  </li>
                                )}
                              </ul>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                We received your request on {createdDate} at{" "}
                                {createdTime}
                                {finishedDate &&
                                  finishedTime &&
                                  `, and we finished on ${finishedDate} at ${finishedTime}`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Badge className="flex-shrink-0 max-w-[20%] text-center">
                          {content.category}
                        </Badge>

                        <div className="flex-shrink-0 max-w-[20%] grid grid-cols-2 gap-1">
                          {content.options.split(",").map((item, index) => (
                            <Badge
                              key={index}
                              className="text-center font-light"
                              style={{
                                backgroundColor: `${StringToColor(item, 0.5)}`,
                              }}
                              variant="outline"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>

                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="flex justify-end w-full">
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                disabled={content.status != "Success"}
                                asChild
                              >
                                <Link
                                  to={`${HostURL}/generated/content/view/${content.jobid}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open in new tab
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-primary pointer-events-none opacity-100">{`${
                                content.creditsused
                              } credit${
                                content.creditsused > 1 ? "s" : ""
                              } used`}</DropdownMenuItem>

                              {content.status == "Failed" && (
                                <DropdownMenuItem
                                  className="text-black hover:text-black focus:text-black bg-primary brightness-75 hover:brightness-100 focus:brightness-100 hover:bg-primary focus:bg-primary"
                                  onClick={() => retryGeneration(content, page)}
                                >
                                  Retry
                                </DropdownMenuItem>
                              )}
                              <AlertDialogTrigger asChild>
                                {GetPlainDestructiveDropDownFromStatus(
                                  content.status
                                )}
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete '
                                {content.displayname.length == 0
                                  ? content.jobid
                                  : content.displayname}
                                ' from our servers. You will not be refunded in
                                credits.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (
                                    content.status == "Success" ||
                                    content.status == "Failed"
                                  ) {
                                    deleteGeneration(
                                      page,
                                      content.jobid,
                                      content.displayname
                                    );
                                  } else {
                                    cancelGeneration(
                                      page,
                                      content.jobid,
                                      content.displayname
                                    );
                                  }
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Button>
                    </div>
                  );
                })}
            </div>
          </Desktop>

          <Pagination className="bottom-14 absolute w-full px-5 left-0 right-0">
            <PaginationContent className={cn("", isMobile ? "gap-0" : "")}>
              {!isMobile && page > 0 && (
                <PaginationItem className="left-2 fixed">
                  <PaginationPrevious
                    onClick={() => {
                      setPage(Math.max(page - 1, 0));
                    }}
                  />
                </PaginationItem>
              )}
              {Array(totalPages)
                .fill(null)
                .map((_, index) => {
                  const maxRange = isMobile
                    ? PAGE_ON_SCREEN_MOBILE
                    : PAGE_ON_SCREEN_PC;
                  const range = Math.abs(index - page);
                  const isInRange =
                    range <= maxRange || index == 0 || index == totalPages - 1;
                  if (isInRange) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={index === page}
                          onClick={() => setPage(index)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (range <= maxRange + 1) {
                    return <PaginationEllipsis />;
                  }
                  return null;
                })}
              {!isMobile && totalPages != page + 1 && (
                <PaginationItem className="right-2 fixed">
                  <PaginationNext
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}

export default ViewGeneratedPage;
