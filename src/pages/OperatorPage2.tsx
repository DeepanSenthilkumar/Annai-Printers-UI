// import Layout from "../components/Layout";

// export default function OperatorPage2() {
//   return (
//     <Layout>
//       <h1 className="text-3xl font-bold mb-6">Orders</h1>

//       <div className="bg-white p-6 rounded-xl shadow">
//         <p className="text-gray-600">
//           Order #1024 - Wedding Invitation - In Progress
//         </p>
//       </div>
//     </Layout>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";

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

      <button onClick={handleBack} className="mb-6 text-blue-600 hover:underline">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Service Details
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">No. of Pages</th>
              <th className="p-3 text-left">Cost per Page</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  {row.service} ({row.pageType})
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    min="1"
                    className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={row.pages || ""}
                    onChange={(e) =>
                      handlePageChange(index, e.target.value)
                    }
                  />
                </td>

                <td className="p-3">
                  ₹{row.costPerPage}
                </td>

                <td className="p-3 font-semibold">
                  ₹{row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <div className="text-lg font-bold">
            Grand Total: ₹{grandTotal}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save & Submit
        </button>
      </div>
    </Layout>
  );
}