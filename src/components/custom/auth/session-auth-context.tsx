/* Import React components and 3rd party libraries */
import { createContext, Dispatch } from "react";

interface SessionAuthContextProps {
  immediateUpdate: Dispatch<void>;
}

export const SessionAuthContext = createContext<SessionAuthContextProps>({
  immediateUpdate: () => {},
});
