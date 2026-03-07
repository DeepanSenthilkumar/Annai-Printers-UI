import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";
import Tables, { Column } from "../components/Tables";
import Select from "react-select";

type ServiceItem = {
  service: string;
  pageType: string;
};

type Option = {
  value: string;
  label: string;
};

export default function OperatorPage1() {
  const navigate = useNavigate();

  const services = ["Xerox", "Print", "Invitation"];
  const pageTypes = ["A4", "A5", "A3", "Legal", "Photo"];

  const [selectedService, setSelectedService] = useState("");
  const [selectedPageType, setSelectedPageType] = useState("");
  // const [items, setItems] = useState<ServiceItem[]>([]);
  const { items, setItems } = useOperatorCart();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const serviceOptions: Option[] = services.map((s) => ({
    value: s,
    label: s,
  }));

  const pageOptions: Option[] = pageTypes.map((p) => ({
    value: p,
    label: p,
  }));

  const columns: Column<ServiceItem>[] = [
    {
      header: "S.No",
      accessor: "service",
      render: (_row: ServiceItem, index: number) => index + 1,
    },
    {
      header: "Service",
      accessor: "service",
    },
    {
      header: "Page Type",
      accessor: "pageType",
    },
    {
      header: "Action",
      accessor: "service",
      align: "center",
      cellClassName : "flex justify-center",
      render: (_row: ServiceItem, index: number) => (
        <button onClick={() => handleEdit(index)} className="flex items-center p-1 text-blue-600 text-sm hover:text-white hover:bg-blue-600 rounded-md">
          <span className="material-icons text-[16px]">edit</span>
        </button>
      ),
    },
  ];

  const handleAdd = () => {
    if (!selectedService || !selectedPageType) {
      alert("Select both Service and Page Type");
      return;
    }

    const newItem = {
      service: selectedService,
      pageType: selectedPageType,
    };

    // Prevent duplicates
    const isDuplicate = items.some(
      (item, index) =>
        item.service === newItem.service &&
        item.pageType === newItem.pageType &&
        index !== editIndex
    );

    if (isDuplicate) {
      alert("Duplicate entry not allowed");
      return;
    }

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = newItem;
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    setSelectedService("");
    setSelectedPageType("");
  };

  const handleEdit = (index: number) => {
    setSelectedService(items[index].service);
    setSelectedPageType(items[index].pageType);
    setEditIndex(index);
  };

  const handleNext = () => {
    if (items.length < 1) return;

    navigate("/calculation", {
      state: { selectedItems: items },
    });
  };

  const handleServiceChange = (option: Option | null) => {
    setSelectedService(option ? option.value : "");
  };

  const handlePageChange = (option: Option | null) => {
    setSelectedPageType(option ? option.value : "");
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

      {/* Dropdown Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex gap-6 items-end">
          {/* Service Dropdown */}
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">
              Service
            </label>
            <Select options={serviceOptions} value={serviceOptions.find((o) => o.value === selectedService) || null}
             onChange={handleServiceChange} placeholder="Select Service" isClearable/>
          </div>

          {/* Page Type Dropdown */}
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">
              Page Type
            </label>
            <Select options={pageOptions} value={pageOptions.find((o) => o.value === selectedPageType) || null}
             onChange={handlePageChange} placeholder="Select Page Type" isClearable/>
          </div>

          {/* Add Button */}
          <div className="w-auto">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          <Tables<ServiceItem> columns={columns} data={items}/>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={items.length < 1}
          className={`px-6 py-2 rounded-md text-white transition ${
            items.length < 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}