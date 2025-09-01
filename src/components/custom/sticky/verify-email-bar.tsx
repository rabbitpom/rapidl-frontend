import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store/configure-store";

function VerifyEmailBar() {
  const [show, setShow] = useState(true);
  const emailVerified = useSelector(
    (state: RootState) => state.userReducer.emailVerified
  );
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );

  const handleClick = useCallback(() => {
    setShow(false);
    if (sessionEnded) {
      return;
    }
    if (emailVerified) {
      return;
    }
    axios
      .put(`/send-verify`)
      .then((_) => {})
      .catch((_) => {});
  }, [emailVerified, sessionEnded]);

  return (
    !sessionEnded &&
    !emailVerified &&
    show && (
      <div className="bg-primary fixed z-50 bottom-0 left-0 w-full text-black h-12 flex items-center justify-center">
        <p className="text-center font-bold">
          Verify your email now by{" "}
          <Button
            variant="link"
            asChild
            className="text-black font-bold m-0 p-0 text-base"
            onClick={() => {
              handleClick();
            }}
          >
            <span>clicking here</span>
          </Button>
          .
        </p>
      </div>
    )
  );
}

export default VerifyEmailBar;
