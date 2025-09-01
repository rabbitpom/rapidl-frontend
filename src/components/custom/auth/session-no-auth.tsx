import { ReactNode, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "@/store/configure-store";
import { SessionAuthContext } from "./session-auth-context";

interface Props {
  children?: ReactNode;
  altChildren?: ReactNode;
  redirect?: string;
}

function SessionNoAuth({ children, altChildren, redirect }: Props) {
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );
  const sessionAuth = useContext(SessionAuthContext);
  const NavigateTo = useNavigate();

  useEffect(() => {
    sessionAuth.immediateUpdate();
  }, []);

  if (redirect) {
    useEffect(() => {
      if (!sessionEnded) {
        NavigateTo(redirect, { replace: true });
      }
    }, [sessionEnded]);
  }

  return <>{!sessionEnded ? altChildren : children}</>;
}

export default SessionNoAuth;
