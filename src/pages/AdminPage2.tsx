import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function AdminPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const bill = location.state.bill;
  const services = bill?.items || [];

  const handlePrint = () => {
    window.print();
  }

  return (
    <Layout>
      {/* Back Button */}
      <div className="mb-4 justify-self-end print:hidden">
        <button onClick={() => navigate("/admin", { state: { fromDetail: true }})} className="text-[#1F8CF9]">
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
            
            <div className="absolute right-0 text-gray-400 top-0 print:hidden hover:text-gray-600" onClick={handlePrint}>
              <button className="material-icons">print</button>
            </div>
          </div>

          <div className="mb-3 font-semibold flex justify-between">
            <span>Bill.No: {bill.billNumber}</span>
            <span>Date: {new Date(bill.date).toLocaleDateString()}</span>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm border border-black border-collapse">
            <thead>
              <tr>
                <th className="border border-black p-2 w-12">S.No</th>
                <th className="border border-black p-2 text-left">Service Provided</th>
                <th className="border border-black p-2 w-32">No. of Pages</th>
                <th className="border border-black p-2 w-32">Price</th>
                <th className="border border-black p-2 w-32">Total</th>
              </tr>
            </thead>

            <tbody>
              {services.map((item: any, index: number) => {
                return (
                  <tr key={item.id}>
                    <td className="border border-black p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2">
                      {item.serviceName}
                    </td>
                    <td className="border border-black p-2 text-center">
                      {item.noOfPage}
                    </td>
                    <td className="border border-black p-2 text-center">
                      ₹{item.costPerPage}
                    </td>
                    <td className="border border-black p-2 text-center">
                      ₹{item.total}
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
                <span>₹{bill.billTotal}</span>
              </div>

              <div className="flex justify-between p-2 font-semibold">
                <span>Grand Total</span>
                <span>₹{bill.billTotal}</span>
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