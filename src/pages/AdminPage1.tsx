import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Tables, { Column } from "../components/Tables";

type BillData = {
  id: number;
  status: boolean;
  bill: string;
  user: string;
  amount: number;
};

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

  const columns: Column<BillData>[] = [
    {
      header: "S.No",
      accessor: "id",
      render: (_row: BillData, index: number) => index + 1,
    },
    {
      header: "Print Status",
      accessor: "status",
      render: (row: BillData) => (
        <span className={`inline-block w-3 h-3 rounded-full ${row.status ? "bg-[#1F8CF9]" : "bg-green-500"}`}/>
      ),
    },
    { header: "Bill No", accessor: "bill" },
    { header: "User ID", accessor: "user" },
    {
      header: "Total Amount",
      accessor: "amount",
      render: (row: BillData) => `₹${row.amount}`,
    },
    {
      header: "Details",
      accessor: "bill",
      render: () => (
        <button onClick={() => navigate("/detailView")} className="text-[#1F8CF9] hover:underline">
          View
        </button>
      ),
    },
    {
      header: "Action",
      accessor: "bill",
      render: () => (
        <button className="text-gray-600 hover:text-[#1F8CF9]" title="Print">
          <span className="material-icons text-[20px]">print</span>
        </button>
      ),
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
        <Tables<BillData> columns={columns} data={data} headerClassName="bg-[#1F8CF9] text-white"/>
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