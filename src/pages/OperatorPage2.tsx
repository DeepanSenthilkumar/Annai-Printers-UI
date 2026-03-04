import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";
import Tables, { Column } from "../components/Tables";

type RowType = {
  service: string;
  pageType: string;
  pages: number;
  costPerPage: number;
  total: number;
};

export default function OperatorPage2() {
  const navigate = useNavigate();
  const { items, clearCart } = useOperatorCart();

  const [rows, setRows] = useState<RowType[]>([]);

  const columns: Column<RowType>[] = [
    {
      header: "S.No",
      accessor: "service",
      render: (_row: RowType, index: number) => index + 1,
    },
    {
      header: "Service",
      accessor: "service",
      render: (row: RowType) => `${row.service} (${row.pageType})`,
    },
    {
      header: "No. of Pages",
      accessor: "pages",
      render: (row: RowType, index: number) => (
        <input type="number" min="1" value={row.pages}
          onChange={(e) => handlePageChange(index, e.target.value)}
          className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ),
    },
    {
      header: "Cost per Page",
      accessor: "costPerPage",
      render: (row: RowType) => `₹${row.costPerPage}`,
    },
    {
      header: "Total",
      accessor: "total",
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

  // Hard coded pricing list
  const priceList = [
    { service: "Xerox", pageType: "A4", price: 2 },
    { service: "Xerox", pageType: "A3", price: 5 },
    { service: "Xerox", pageType: "A5", price: 5 },
    { service: "Print", pageType: "A4", price: 4 },
    { service: "Print", pageType: "A3", price: 8 },
    { service: "Print", pageType: "A5", price: 8 },
    { service: "Invitation", pageType: "Photo", price: 15 },
  ];

  // Initialize rows with pricing
  useEffect(() => {
    const mappedRows: RowType[] = items.map((item) => {
      const match = priceList.find(
        (p) =>
          p.service === item.service &&
          p.pageType === item.pageType
      );

      return {
        service: item.service,
        pageType: item.pageType,
        pages: 0,
        costPerPage: match ? match.price : 0,
        total: 0,
      };
    });

    setRows(mappedRows);
  }, [items]);

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

  const handleSubmit = () => {
    const invalid = rows.some(
      (row) => !row.pages || row.pages <= 0
    );

    if (invalid) {
      alert("Please fill all No. of Pages fields with valid values.");
      return;
    }

    const payload = {
      date: new Date(),
      items: rows,
    };

    console.log("Final Billing Payload:", payload);

    clearCart();
    navigate("/operator");
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

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
          Save & Submit
        </button>
      </div>
    </Layout>
  );
}