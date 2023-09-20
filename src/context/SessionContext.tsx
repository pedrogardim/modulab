import React, { createContext, useContext, ReactNode, useState } from "react";

type SessionType = {
  nodes: [];
  setNodes: React.Dispatch<React.SetStateAction<[]>>;
};

const SessionContext = createContext<SessionType | undefined>(undefined);

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<[]>([]);

  return (
    <SessionContext.Provider value={{ nodes, setNodes }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
