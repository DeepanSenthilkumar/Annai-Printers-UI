import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";
import Tables, { Column } from "../components/Tables";
import Select from "react-select";
import { ApiService } from "../api/services";
import { toaster } from "../components/toaster";

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
  const [selectedServiceId, setSelectedServiceId] = useState<string  | null>(null)
  const [selectedServiceName, setSelectedServiceName] = useState("")
  const [selectedPageTypeId, setSelectedPageTypeId] = useState<string  | null>(null)
  const [selectedPageTypeName, setSelectedPageTypeName] = useState("")
  const { items, setItems, services, setServices } = useOperatorCart();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [originalItem, setOriginalItem] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (services.length === 0) {
      getAllService();
    }
  }, []);

  const getAllService = async () => {
    try {
      const response = await ApiService.getAllService();

      if (response.isAdded) {
        setServices(response.services);
      }

    } catch (error) {
      console.error("Service fetch failed", error);
    }
  };

  const serviceOptions: Option[] = [
    ...new Map(
      services.map((s) => [
        s.serviceId,
        { value: s.serviceId, label: s.serviceName },
      ])
    ).values(),
  ];

  const pageOptions: Option[] = services.filter((s) => s.serviceId === selectedServiceId)
    .map((s) => ({value: s.pageTypeId, label: s.pageType,}));

  const columns: Column<ServiceItem>[] = [
    {header: "S.No", accessor: "service", render: (_row: ServiceItem, index: number) => index + 1,},
    {header: "Service", accessor: "service",},
    {header: "Page Type", accessor: "pageType",},
    {header: "Action", accessor: "service", align: "center", cellClassName : "flex justify-center",
      render: (_row: ServiceItem, index: number) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(index)} className="flex items-center p-1 text-blue-600 text-sm hover:text-white hover:bg-blue-600 rounded-md">
            <span className="material-icons text-[16px]">edit</span>
          </button>

          <button onClick={() => handleDelete(index)} className="flex items-center p-1 text-red-500 text-sm hover:text-white hover:bg-red-500 rounded-md">
            <span className="material-icons text-[16px]">delete</span>
          </button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    if (!selectedServiceName  || !selectedPageTypeName) {
      toaster.warning('Select both Service and Page Type', "Warning");
      return;
    }

    const newItem = {
      service: selectedServiceName,
      pageType: selectedPageTypeName,
    };

    const isDuplicate = items.some((item, index) => item.service === newItem.service && item.pageType === newItem.pageType && index !== editIndex);

    if (isDuplicate) {
      toaster.warning("Service with page already selected, Please check", "Warning");
      return;
    }

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = newItem;
      setItems(updated);
    } else {
      setItems([...items, newItem]);
    }
    cancelEdit();
  };

  const handleEdit = async (index: number) => {
    debugger
    const row = items[index]
    setEditIndex(index)
    setOriginalItem(row);
    const serviceObj = services.find(s => s.serviceName === row.service)
    const page = services.find((s) => s.serviceName === row.service && s.pageType === row.pageType);

    if (!serviceObj) return
    if (!page) return

    setSelectedServiceId(serviceObj.serviceId)
    setSelectedServiceName(serviceObj.serviceName)
    setSelectedPageTypeId(page.pageTypeId);
    setSelectedPageTypeName(page.pageType);
  }

  const handleNext = () => {
    if (items.length < 1) return;

    navigate("/calculation", {
      
    });
  };

  const handleServiceChange = async (option: Option | null) => {
    debugger
    if (!option) {
      setSelectedServiceId(null)
      setSelectedServiceName("")
      setSelectedPageTypeId(null);
      setSelectedPageTypeName("");
      return
    }

    setSelectedServiceId(option.value);
    setSelectedServiceName(option.label);
    setSelectedPageTypeId(null);
    setSelectedPageTypeName("");
  };

  const handlePageChange = (option: Option | null) => {
    if (!option) {
      setSelectedPageTypeId(null)
      setSelectedPageTypeName("")
      return
    }

    setSelectedPageTypeId(option.value)
    setSelectedPageTypeName(option.label)
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setOriginalItem(null);
    setSelectedServiceId(null)
    setSelectedServiceName("")
    setSelectedPageTypeId(null)
    setSelectedPageTypeName("")
  }

  const isUpdateDisabled: boolean = editIndex !== null && !!originalItem && originalItem.service === selectedServiceName && originalItem.pageType === selectedPageTypeName;

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex gap-6 items-end">
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">
              Service
            </label>
            <Select options={serviceOptions} value={serviceOptions.find((o) => o.value === selectedServiceId) || null}
             onChange={handleServiceChange} placeholder="Select Service" isClearable/>
          </div>

          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">
              Page Type
            </label>
            <Select options={pageOptions} value={pageOptions.find((o) => o.value === selectedPageTypeId) || null}
             onChange={handlePageChange} placeholder="Select Page Type" isClearable/>
          </div>

          <div className="w-auto flex gap-2">
            <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition" disabled={isUpdateDisabled}>
              {editIndex !== null ? "Update" : "Add"}
            </button>
            
            {editIndex !== null && (<button onClick={cancelEdit} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition">
              Cancel
            </button>)}
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          <Tables<ServiceItem> columns={columns} data={items}/>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleNext} disabled={items.length < 1}
          className={`px-6 py-2 rounded-md text-white transition ${items.length < 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
          Next
        </button>
      </div>
    </Layout>
  );
}