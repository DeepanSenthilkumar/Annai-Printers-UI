import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function AdminPage2() {
  const navigate = useNavigate();

  const services = [
    { id: 1, service: "Xerox", pages: 120, price: 2 },
    { id: 2, service: "Spiral Binding", pages: 5, price: 25 },
    { id: 3, service: "Color Print", pages: 30, price: 10 },
  ];

  const calculateTotal = (pages: number, price: number) => {
    return pages * price;
  };

  const consolidatedTotal = services.reduce(
    (acc, item) => acc + calculateTotal(item.pages, item.price),
    0
  );

  const handlePrint = () => {
    window.print();
  }

  return (
    <Layout>

      {/* Back Button */}
      <div className="mb-4 justify-self-end print:hidden">
        <button onClick={() => navigate(-1)} className="text-[#1F8CF9]">
          <span className="material-icons">subdirectory_arrow_left</span>
        </button>
      </div>
      <div className="flex justify-center">
        <div className="bg-white px-10 py-8 min-h-[520px] w-[900px] border 
        border-gray-300 print:w-full print:border-none print:px-0 print:py-0">

          <div className="relative flex items-center mb-6">
            <h2 className="mx-auto text-center text-xl font-bold tracking-wide">
              ANNAI PRINTERS
            </h2>
            
            <div className="absolute right-0 top-0 print:hidden" onClick={handlePrint}>
              <button className="material-icons">print</button>
            </div>
          </div>

          <div className="mb-3 font-semibold flex justify-between">
            <span>Bill.No: B1122</span>
            <span>Date: 27-02-2026</span>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm border border-black border-collapse">
            <thead>
              <tr>
                <th className="border border-black p-2 w-12">S.No</th>
                <th className="border border-black p-2 text-left">
                  Service Provided
                </th>
                <th className="border border-black p-2 w-32">
                  No. of Pages
                </th>
                <th className="border border-black p-2 w-32">
                  Price
                </th>
                <th className="border border-black p-2 w-32">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {services.map((item, index) => {
                const total = calculateTotal(item.pages, item.price);
                return (
                  <tr key={item.id}>
                    <td className="border border-black p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2">
                      {item.service}
                    </td>
                    <td className="border border-black p-2 text-center">
                      {item.pages}
                    </td>
                    <td className="border border-black p-2 text-center">
                      ₹{item.price}
                    </td>
                    <td className="border border-black p-2 text-center">
                      ₹{total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Section - Compact & Standard */}
          <div className="flex justify-end mt-6">
            <div className="w-64 text-sm border border-black">

              <div className="flex justify-between p-2 border-b border-black">
                <span>Subtotal</span>
                <span>₹{consolidatedTotal}</span>
              </div>

              <div className="flex justify-between p-2 font-semibold">
                <span>Grand Total</span>
                <span>₹{consolidatedTotal}</span>
              </div>

            </div>
          </div>

          {/* Seal / Signature */}
          <div className="flex justify-end mt-10">
            <div className="text-center">
              <div className="w-40 h-16 border border-black mb-2"></div>
              <span className="text-xs">Authorized Seal</span>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}