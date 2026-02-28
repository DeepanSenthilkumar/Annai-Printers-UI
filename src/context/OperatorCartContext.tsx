import { createContext, useContext, useState, ReactNode } from "react";

export type ServiceItem = {
  service: string;
  pageType: string;
};

type OperatorCartContextType = {
  items: ServiceItem[];
  setItems: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  clearCart: () => void;
};

const OperatorCartContext = createContext<OperatorCartContextType | undefined>(
  undefined
);

export const OperatorCartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [items, setItems] = useState<ServiceItem[]>([]);

  const clearCart = () => {
    setItems([]);
  };

  return (
    <OperatorCartContext.Provider value={{ items, setItems, clearCart }}>
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