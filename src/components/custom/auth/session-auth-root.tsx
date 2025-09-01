import { ReactNode, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { hasExpiredWithinMargin } from "@/lib/utils";
import { RootState } from "@/store/configure-store";
import { setExpiry, selfUpdate } from "@/store/slices/token";

import { SessionAuthContext } from "./session-auth-context";

interface Props {
  children?: ReactNode;
}

function SessionAuthRoot({ children }: Props) {
  const NOP = (..._: any[]) => {};
  const dbg = DISABLE_TOKEN_LOG
    ? {
        log: NOP,
        debug: NOP,
        error: NOP,
        group: NOP,
        groupEnd: NOP,
        groupCollapsed: NOP,
      }
    : {
        log: console.log,
        debug: console.debug,
        error: console.error,
        group: console.group,
        groupEnd: console.groupEnd,
        groupCollapsed: console.groupCollapsed,
      };

  const expiry = useSelector((state: RootState) => state.tokenReducer.expiry);
  const expiredWithinMargin = useSelector(
    (state: RootState) => state.tokenReducer.expiredWithinMargin
  );
  const dispatch = useDispatch();
  const autoRefreshing = useRef(false);

  function force_expire() {
    dbg.group("Force Expire");
    dispatch(setExpiry(0));
    dbg.groupEnd();
  }
  function read_update_access_expire() {
    dbg.group("Read Update Access Expire");
    if (expiry == 0) {
      dbg.groupEnd();
      return;
    }
    dispatch(selfUpdate());
    if (!expiredWithinMargin) {
      dbg.groupEnd();
      return;
    }
    if (autoRefreshing.current) {
      dbg.log("Cannot autorefresh as a request is already being processed");
      dbg.groupEnd();
      return;
    }
    autoRefreshing.current = true;
    dbg.log("Attempting autorefresh");
    axios
      .post("/refresh-tokens")
      .then((response) => {
        dbg.log("Got a successful response, ", response);
        const x_atk_ex =
          response.headers["x-atk-ex"] ?? response.headers["X-Atk-Ex"];
        if (x_atk_ex) {
          dbg.log("Found X-ATK-EX headers, parsing now");
          const parsed_x_atk_ex = parseInt(x_atk_ex, 10);
          if (isNaN(parsed_x_atk_ex)) {
            dbg.log("Failed to parse");
            force_expire();
          } else {
            const hasExpired = hasExpiredWithinMargin(parsed_x_atk_ex);
            dbg.log(
              "Successfully parsed ",
              parsed_x_atk_ex,
              ", has expired: ",
              hasExpired
            );
            dispatch(setExpiry(parsed_x_atk_ex));
          }
        } else {
          dbg.log("No X-ATK-EX headers");
          force_expire();
        }
        dbg.groupEnd();
        autoRefreshing.current = false;
      })
      .catch((err) => {
        dbg.log("Failure, ", err);
        force_expire();
        dbg.groupEnd();
        autoRefreshing.current = false;
      });
  }

  useEffect(() => {
    read_update_access_expire();
    const intervalId = setInterval(() => {
      read_update_access_expire();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expiredWithinMargin, expiry]);

  return (
    <>
      <SessionAuthContext.Provider
        value={{
          immediateUpdate: read_update_access_expire,
        }}
      >
        {children}
      </SessionAuthContext.Provider>
    </>
  );
}

export default SessionAuthRoot;
