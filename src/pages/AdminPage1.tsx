import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminPage1() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const data = [
    {
      id: 1,
      status: true,
      bill: "BILL-1001",
      user: "OP01",
      amount: 2500,
    },
    {
      id: 2,
      status: false,
      bill: "BILL-1002",
      user: "OP02",
      amount: 4000,
    },
  ];

  return (
    <Layout>

      {/* ===== Section 3 - Cards ===== */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <Card title="Total Orders" value="152" />
        <Card title="Revenue" value="₹1,24,000" />
        <Card title="Completed" value="140" />
        <Card title="Pending" value="12" />
      </div>

      {/* ===== Section 5 - Search + Download ===== */}
      <div className="flex justify-between items-center mb-6">
        
        <div className="flex">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Bill No..."
           className="h-[42px] w-[250px] px-4 border border-[#E0E2E6] rounded-l-md outline-none focus:border-[#1F8CF9]"/>

          <button className="h-[42px] px-4 flex justify-center items-center bg-[#1F8CF9] text-white rounded-r-md">
            <span className="material-icons">search</span>
            Search
          </button>
        </div>

        <button className="px-5 h-[42px] gap-2 flex justify-center items-center bg-green-600 text-white rounded-md hover:bg-green-700">
          <span className="material-icons text-[18px]">download</span>
          Download
        </button>
      </div>

      {/* ===== Section 4 - Table ===== */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#1F8CF9] text-white">
            <tr>
              <th className="p-4 text-left">S.No</th>
              <th className="p-4 text-left">Print Status</th>
              <th className="p-4 text-left">Bill No</th>
              <th className="p-4 text-left">User ID</th>
              <th className="p-4 text-left">Total Amount</th>
              <th className="p-4 text-left">Details</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{index + 1}</td>

                <td className="p-4">
                  <span className={`inline-block w-3 h-3 rounded-full ${item.status? "bg-[#1F8CF9]" : "bg-green-500"}`}></span>
                </td>
                <td className="p-4">{item.bill}</td>
                <td className="p-4">{item.user}</td>
                <td className="p-4">₹{item.amount}</td>
                <td className="p-4">
                  <button onClick={() => navigate("/detailView")} className="text-[#1F8CF9] hover:underline">
                    View
                  </button>
                </td>

                <td className="p-4">
                  <button className="text-gray-600 hover:text-[#1F8CF9]">
                    🖨️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <h3 className="text-[#575E6B] text-sm">{title}</h3>
      <p className="text-2xl font-bold text-[#16181D] mt-3">
        {value}
      </p>
    </div>
  );
}