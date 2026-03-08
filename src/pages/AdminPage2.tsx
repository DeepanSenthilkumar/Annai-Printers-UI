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


// import Layout from "../components/Layout";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// type BillItem = {
//   serviceId: string;
//   serviceName: string;
//   pageType: string;
//   pageTypeId: string;
//   costPerPage: number;
//   noOfPage: number;
//   total: number;
// };

// type BillData = {
//   _id: string;
//   billNumber: string;
//   userId: string;
//   billTotal: number;
//   date: string;
//   printStatus: boolean;
//   items: BillItem[];
//   autoPrint?: boolean;
// };

// export default function AdminPage2() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const bill: BillData = location.state;

//   const services = bill?.items || [];

//   // =============================
//   // AUTO PRINT
//   // =============================

//   useEffect(() => {
//     if (bill?.autoPrint) {
//       setTimeout(() => window.print(), 300);
//     }
//   }, [bill]);

//   // =============================
//   // TOTALS
//   // =============================

//   const totalPages = services.reduce((sum, item) => sum + item.noOfPage, 0);
//   const totalAmount = services.reduce((sum, item) => sum + item.total, 0);

//   // =============================
//   // PRINT
//   // =============================

//   const handlePrint = () => {
//     window.print();
//   };

//   if (!bill) {
//     return (
//       <Layout>
//         <div className="p-10 text-center text-red-500">
//           No bill data found
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="bg-white p-10 rounded-xl shadow-sm">

//         {/* HEADER */}

//         <div className="flex justify-between items-center mb-8">

//           <div>
//             <h2 className="text-xl font-bold text-[#16181D]">
//               Bill Details
//             </h2>

//             <p className="text-[#575E6B] mt-2">
//               Bill No: <span className="font-medium">{bill.billNumber}</span>
//             </p>

//             <p className="text-[#575E6B]">
//               Date:{" "}
//               <span className="font-medium">
//                 {new Date(bill.date).toLocaleDateString()}
//               </span>
//             </p>

//             <p className="text-[#575E6B]">
//               User: <span className="font-medium">{bill.userId}</span>
//             </p>
//           </div>

//           <button
//             onClick={handlePrint}
//             className="bg-[#1F8CF9] text-white px-6 py-2 rounded-md hover:bg-[#0f6fd1]"
//           >
//             Print
//           </button>
//         </div>

//         {/* TABLE */}

//         <div className="overflow-x-auto">

//           <table className="w-full border-collapse">

//             <thead>
//               <tr className="bg-[#1F8CF9] text-white">

//                 <th className="p-3 text-left">S.No</th>

//                 <th className="p-3 text-left">Service</th>

//                 <th className="p-3 text-left">Page Type</th>

//                 <th className="p-3 text-left">Pages</th>

//                 <th className="p-3 text-left">Cost/Page</th>

//                 <th className="p-3 text-left">Total</th>

//               </tr>
//             </thead>

//             <tbody>

//               {services.map((item, index) => (
//                 <tr
//                   key={index}
//                   className="border-b border-[#E0E2E6]"
//                 >

//                   <td className="p-3">{index + 1}</td>

//                   <td className="p-3">{item.serviceName}</td>

//                   <td className="p-3">{item.pageType}</td>

//                   <td className="p-3">{item.noOfPage}</td>

//                   <td className="p-3">₹{item.costPerPage}</td>

//                   <td className="p-3 font-medium">
//                     ₹{item.total}
//                   </td>

//                 </tr>
//               ))}

//             </tbody>

//           </table>

//         </div>

//         {/* TOTALS */}

//         <div className="mt-8 flex justify-end">

//           <div className="w-[260px] space-y-3">

//             <div className="flex justify-between text-[#575E6B]">
//               <span>Total Pages</span>
//               <span>{totalPages}</span>
//             </div>

//             <div className="flex justify-between text-lg font-bold text-[#16181D] border-t pt-3">
//               <span>Grand Total</span>
//               <span>₹{totalAmount}</span>
//             </div>

//           </div>

//         </div>

//         {/* BACK */}

//         <div className="mt-10">

//           <button
//             onClick={() => navigate(-1)}
//             className="text-[#1F8CF9] hover:underline"
//           >
//             ← Back
//           </button>

//         </div>

//       </div>
//     </Layout>
//   );
// }