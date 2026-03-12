import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";
import Tables, { Column } from "../components/Tables";
import { toaster } from "../components/toaster";
import { ApiService } from "../api/services";

type RowType = {
  service: string;
  pageType: string;
  pages: number;
  costPerPage: number;
  total: number;
};

export default function OperatorPage2() {
  const navigate = useNavigate();
  const { items, services, clearCart } = useOperatorCart();

  const [rows, setRows] = useState<RowType[]>([]);

  const columns: Column<RowType>[] = [
    {header: "S.No", accessor: "service", render: (_row: RowType, index: number) => index + 1,},
    {header: "Service", accessor: "service", render: (row: RowType) => `${row.service} (${row.pageType})`,},
    {header: "No. of Pages", accessor: "pages",
      render: (row: RowType, index: number) => (
        <input type="number" min="1" value={row.pages} onChange={(e) => handlePageChange(index, e.target.value)}
          className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      ),
    },
    {header: "Cost per Page", accessor: "costPerPage", render: (row: RowType) => `₹${row.costPerPage}`,
    },
    {header: "Total", accessor: "total",
      render: (row: RowType) => (
        <span className="font-semibold">
          ₹{row.total}
        </span>
      ),
    },
  ];

  // Hard refresh protection
  useEffect(() => {
    if (!items || items.length === 0) {
      clearCart();
      navigate("/operator", { replace: true });
    }
  }, []);

  useEffect(() => {
    const mappedRows: RowType[] = items.map((item) => {

      const match = services.find((s) => s.serviceName === item.service && s.pageType === item.pageType);

      return {
        service: item.service,
        pageType: item.pageType,
        pages: 0,
        costPerPage: match ? match.costPerPage : 0,
        total: 0,
      };
    });

    setRows(mappedRows);
  }, [items, services]);

  const handlePageChange = (index: number, value: string) => {
    const num = Number(value);
    const updated = [...rows];
    updated[index].pages = num;
    updated[index].total = num * updated[index].costPerPage;

    setRows(updated);
  };

  const grandTotal = useMemo(() => {
    return rows.reduce((acc, row) => acc + row.total, 0);
  }, [rows]);

  const handleSubmit = async () => {
    debugger
    const invalid = rows.some((row) => !row.pages || row.pages <= 0);

    if (invalid) {
      toaster.warning("Please fill all No of Pages fields with valid values", "Warning");
      return;
    }

    const today = new Date();
    const localDate = today.toLocaleDateString("en-CA"); 

    const billItems = rows.map((row) => {
      const match = services.find((s) => s.serviceName === row.service && s.pageType === row.pageType);

      return {
        serviceId: match?.serviceId || "",
        serviceName: row.service,
        pageType: row.pageType,
        pageTypeId: match?.pageTypeId || "",
        costPerPage: row.costPerPage,
        noOfPage: row.pages,
        total: row.total,
      };
    });

    const requestBody = {
      userId: sessionStorage.getItem('userName'), // replace later with logged user
      billTotal: grandTotal,
      date: localDate,
      printStatus: false,
      items: billItems,
    };

    try {
      const response = await ApiService.submitBill(requestBody);

      if (response?.isAdded) {
        toaster.success(response.message, "Success");
        console.log("Bill saved:", requestBody);
        clearCart();
        navigate("/operator");
      }

    } catch (error) {
      console.error("Bill submit failed", error);
    }

    // clearCart();
    // navigate("/operator");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="mb-4 justify-self-end print:hidden">
        <button onClick={() => handleBack()} className="text-[#1F8CF9]">
          <span className="material-icons">subdirectory_arrow_left</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Service Details
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Tables<RowType> columns={columns} data={rows} />
      </div>

      <div className="flex justify-end p-6 border-t bg-gray-50">
        <div className="text-lg font-bold">
          Grand Total: ₹{grandTotal}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
          Save & Submit
        </button>
      </div>
    </Layout>
  );
}