import Layout from "../components/Layout";
import { useNavigate  } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Tables, { Column } from "../components/Tables";
import { ApiService } from "../api/services";
import { useAdminBills } from "../context/AdminBillsContext";
import { toaster } from "../components/toaster";

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

export default function AdminPage1() {
  
  const navigate = useNavigate();
  const initialLoad = useRef(false);
  const { bills, setBills, summary, setSummary, pageNumber, setPageNumber, totalPages, setTotalPages} = useAdminBills();
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const groupSize = 5;

  useEffect(() => {
    debugger
    if (!initialLoad.current) {
      initialLoad.current = true;
      if (bills.length === 0) {
        getAllBill(1);
      }
    }
  }, []);

  const getAllBill = async (page = 1, searchText = "") => {
    debugger
    try {
      const requestBody = {
        pageNumber: page,
        pageSize: 10,
        userId: "",
        billNumber: searchText,
      };
      console.log(requestBody);
      setBills([])
      const response = await ApiService.getAllBill(requestBody);

      if (response?.isAdded) {
        console.log(response)
        setBills(response.bills);
        setSummary(response.todaySummary);
        setPageNumber(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Fetch bill failed", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('I am called from auto refresh')
      getAllBill(pageNumber, search);
    }, 60000);

    return () => clearInterval(interval);
  }, [pageNumber, search]);

  const handleSearch = () => {
    getAllBill(1, search);
  };

  const handleView = (row: BillData) => {
    navigate("/detailView", { state: { bill: row, fromAdmin: true } });
  };

  const currentGroupStart = Math.floor((pageNumber - 1) / groupSize) * groupSize + 1;
  const currentGroupEnd = Math.min(currentGroupStart + groupSize - 1, totalPages);
  const pages = [];

  for (let i = currentGroupStart; i <= currentGroupEnd; i++) {pages.push(i);}

  const goToPage = (page: number) => {
    debugger
    setPageNumber(page);
    getAllBill(page, search);
  };

  const goPrevGroup = () => {
    if (currentGroupStart > 1) {
      const page = currentGroupStart - 1;
      setPageNumber(page);
      getAllBill(page, search);
    }
  };

  const goNextGroup = () => {
    debugger
    if (currentGroupEnd < totalPages) {
      const page = currentGroupEnd + 1;
      setPageNumber(page);
      getAllBill(page, search);
    }
  };

  const columns: Column<BillData>[] = [
    {header: "S.No", accessor: "billNumber", render: (_row, index) => (pageNumber - 1) * pageSize + index + 1,},
    {header: "Print Status", accessor: "printStatus",
      render: (row) => (<span className={`inline-block w-3 h-3 rounded-full ${row.printStatus ? "bg-green-500": "bg-[#1F8CF9]"}`} title="Print Status"/>),
    },
    { header: "Bill No", accessor: "billNumber" },
    { header: "User ID", accessor: "userId" },
    {header: "Total Amount", accessor: "billTotal", render: (row) => `₹${row.billTotal}`},
    {header: "Action", accessor: "billNumber",
      render: (row) => (
        <button onClick={() => handleView(row)} className="text-gray-600 hover:text-[#1F8CF9]" title="Print">
          <span className="material-icons text-[20px]">print</span>
        </button>
      ),
    },
  ];

  const handleExportBills = async () => {
    try {
      const response = await ApiService.exportBills();

      if (!response?.isAdded) {
        // alert(response.message);
        toaster.error("Export Failed", "Error");
        return;
      }

      // decode base64
      const byteCharacters = atob(response.file);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));

      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // local date for filename
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy
      const fileName = `Annai Printer Report ${formattedDate}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);

      // alert(response.message);
      // toaster.success(response.message, "Success");
      clearAllBills()


    } catch (error) {
      console.error(error);
      // alert("Export failed. Please try again.");
      toaster.error("Export failed. Please try again", "Error");
    }
  };

  const clearAllBills = async() => {
    debugger
    try{
      const response = await ApiService.clearBills();
      debugger
      if (response.isAdded) {
        toaster.success("Export successfull", "Success");
        getAllBill();
      }
    } catch (err) {
      console.log("Something went wrong. Please try again", "Error");
    }
  }

  return (
    <Layout>
      {/* ===== Section 3 - Cards ===== */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <Card title="Total Orders" value={summary ? summary.totalBillsToday.toString() : "0"} />
        <Card title="Revenue" value={summary ? `₹${summary.totalRevenueToday}` : "₹0"} />
        {/* <Card title="Completed" value={summary ? summary.totalPrinted.toString() : "0"} /> */}
        <Card title="Completed" value={summary ? summary.totalYetToPrint.toString() : "0"} />
        {/* <Card title="Pending" value={summary ? summary.totalYetToPrint.toString() : "0"} /> */}
      </div>

      {/* ===== Section 5 - Search + Download ===== */}
      <div className="flex justify-between items-center mb-6">
        
        <div className="flex">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Bill No..."
           className="h-[42px] w-[250px] px-4 border border-[#E0E2E6] rounded-l-md outline-none focus:border-[#1F8CF9]"/>

          <button onClick={handleSearch} className="h-[42px] px-4 flex justify-center items-center bg-[#1F8CF9] text-white rounded-r-md">
            <span className="material-icons">search</span>
            Search
          </button>
        </div>

        <button onClick={handleExportBills} className="px-5 h-[42px] gap-2 flex justify-center items-center bg-green-600 text-white rounded-md hover:bg-green-700">
          <span className="material-icons text-[18px]">download</span>
          Download
        </button>
      </div>

      {/* ===== Section 4 - Table ===== */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Tables<BillData> columns={columns} data={bills} headerClassName="bg-[#1F8CF9] text-white"/>
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        <button onClick={goPrevGroup} disabled={currentGroupStart === 1}
         className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E0E2E6] bg-white hover:bg-gray-100 disabled:opacity-40">
          <span className="material-icons text-[18px]">chevron_left</span>
        </button>

        {pages.map((page) => (
          <button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 rounded-md border text-sm font-medium
             ${page === pageNumber? "bg-[#1F8CF9] text-white border-[#1F8CF9]" : "bg-white border-[#E0E2E6] text-[#575E6B] hover:bg-gray-100"}`}>
            {page}
          </button>
        ))}

        <button onClick={goNextGroup} disabled={currentGroupEnd === totalPages}
         className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E0E2E6] bg-white hover:bg-gray-100 disabled:opacity-40">
          <span className="material-icons text-[18px]">chevron_right</span>
        </button>
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