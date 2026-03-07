import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceItem = {
  service: string;
  pageType: string;
};

export type ServiceConfig = {
  serviceId: string;
  pageTypeId: string;
  serviceName: string;
  pageType: string;
  costPerPage: number;
};

type OperatorCartContextType = {
  items: ServiceItem[];
  setItems: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  services: ServiceConfig[];
  setServices: React.Dispatch<React.SetStateAction<ServiceConfig[]>>;
  clearCart: () => void;
  clearServices: () => void;
  clearAll: () => void;
};

const OperatorCartContext = createContext<OperatorCartContextType | undefined>(
  undefined
);

export const OperatorCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [services, setServices] = useState<ServiceConfig[]>([]);

  const clearCart = () => {
    setItems([]);
  };

  const clearAll = () => {
    setItems([]);
    setServices([]);
  };

  const clearServices = () => {
    setServices([]);
  };

  return (
    <OperatorCartContext.Provider value={{ items, setItems, services, setServices, clearServices, clearCart, clearAll }}>
      {children}
    </OperatorCartContext.Provider>
  );
};

export const useOperatorCart = () => {
  const context = useContext(OperatorCartContext);
  if (!context) {
    throw new Error("useOperatorCart must be used inside OperatorCartProvider");
  }
  return context;
};