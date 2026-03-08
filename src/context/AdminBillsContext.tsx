import { createContext, useContext, useState } from "react";

type BillItem = {
  serviceId: string;
  serviceName: string;
  pageType: string;
  pageTypeId: string;
  costPerPage: number;
  noOfPage: number;
  total: number;
};

type BillData = {
  _id: string;
  billNumber: string;
  userId: string;
  billTotal: number;
  date: string;
  printStatus: boolean;
  items: BillItem[];
};

type Summary = {
  totalRevenueToday: number;
  totalBillsToday: number;
  totalPrinted: number;
  totalYetToPrint: number;
};

type ContextType = {
  bills: BillData[];
  setBills: (b: BillData[]) => void;
  summary: Summary | null;
  setSummary: (s: Summary | null) => void;
  pageNumber: number;
  setPageNumber: (p: number) => void;
  totalPages: number;
  setTotalPages: (t: number) => void;
  clearAdminBills: () => void;
};

const AdminBillsContext = createContext<ContextType | null>(null);

export const AdminBillsProvider = ({ children }: any) => {

  const [bills, setBills] = useState<BillData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const clearAdminBills = () => {
  setBills([]);
  setSummary(null);
  setPageNumber(1);
  setTotalPages(1);
};

  return (
    <AdminBillsContext.Provider
      value={{
        bills,
        setBills,
        summary,
        setSummary,
        pageNumber,
        setPageNumber,
        totalPages,
        setTotalPages,
        clearAdminBills
      }}
    >
      {children}
    </AdminBillsContext.Provider>
  );
};

export const useAdminBills = () => {
  const ctx = useContext(AdminBillsContext);
  if (!ctx) throw new Error("useAdminBills must be used inside provider");
  return ctx;
};