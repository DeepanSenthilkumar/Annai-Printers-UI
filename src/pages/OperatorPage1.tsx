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
  value: number;
  label: string;
};

type Service = {
  serviceId: number
  serviceName: string
}

type PageType = {
  pageTypeId: number
  pageType: string
}

export default function OperatorPage1() {
  const navigate = useNavigate();
  const [services, setService] = useState<Service[]>([])
  const [pageTypes, setPageTypes] = useState<PageType[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedServiceName, setSelectedServiceName] = useState("")
  const [selectedPageTypeId, setSelectedPageTypeId] = useState<number | null>(null)
  const [selectedPageTypeName, setSelectedPageTypeName] = useState("")
  const { items, setItems } = useOperatorCart();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  useEffect(() => {getServiceDropdown()}, [])

  const serviceOptions: Option[] = services.map((s) => ({
    value: s.serviceId,
    label: s.serviceName,
  }));

  const pageOptions: Option[] = pageTypes.map((p) => ({
    value: p.pageTypeId,
    label: p.pageType,
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

  const getServiceDropdown = async () => {
    debugger
    try {
      const response = await ApiService.getServiceDetails()
      if (response.isAdded) {
        setService(response.services)
        console.log(services)
      }
    } catch (error) {
      console.error("Service dropdown fetch failed", error)
    }
  }

  const handleAdd = () => {
    if (!selectedServiceName  || !selectedPageTypeName) {
      toaster.warning('Select both Service and Page Type');
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
      cancelEdit();
    } else {
      setItems([...items, newItem]);
    }

  };

  const handleEdit = async (index: number) => {
    debugger
    const row = items[index]
    setEditIndex(index)
    const serviceObj = services.find(s => s.serviceName === row.service)

    if (!serviceObj) return

    setSelectedServiceId(serviceObj.serviceId)
    setSelectedServiceName(serviceObj.serviceName)

    try {
      const response = await ApiService.getPageType(serviceObj.serviceId)
      if (response.isAdded) {
        setPageTypes(response.pageTypes)
        const pageObj = response.pageTypes.find((p: any) => p.pageType === row.pageType)

        if (pageObj) {
          setSelectedPageTypeId(pageObj.pageTypeId)
          setSelectedPageTypeName(pageObj.pageType)
        }
      }

    } catch (error) {
      console.error("PageType fetch failed", error)
    }
  }

  const handleNext = () => {
    if (items.length < 1) return;

    navigate("/calculation", {
      state: { selectedItems: items },
    });
  };

  const handleServiceChange = async (option: Option | null) => {
    debugger
    if (!option) {
      setSelectedServiceId(null)
      setSelectedServiceName("")
      setPageTypes([])
      return
    }

    setSelectedServiceId(option.value);
    setSelectedServiceName(option.label);

    setPageTypes([]);
    try {
      const response = await ApiService.getPageType(option.value)

      if (response.isAdded) {
        setPageTypes(response.pageTypes)
      }

    } catch (error) {
      console.error("PageType fetch failed", error)
    }
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
    setPageTypes([]);
    setSelectedServiceId(null)
    setSelectedServiceName("")
    setSelectedPageTypeId(null)
    setSelectedPageTypeName("")
  }

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
            <Select options={serviceOptions} value={serviceOptions.find((o) => o.value === selectedServiceId) || null}
             onChange={handleServiceChange} placeholder="Select Service" isClearable/>
          </div>

          {/* Page Type Dropdown */}
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">
              Page Type
            </label>
            <Select options={pageOptions} value={pageOptions.find((o) => o.value === selectedPageTypeId) || null}
             onChange={handlePageChange} placeholder="Select Page Type" isClearable/>
          </div>

          {/* Add Button */}
          <div className="w-auto flex gap-2">
            <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              {editIndex !== null ? "Update" : "Add"}
            </button>
            
            {editIndex !== null && (<button onClick={cancelEdit} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition">
              Cancel
            </button>)}
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
        <button onClick={handleNext} disabled={items.length < 1}
          className={`px-6 py-2 rounded-md text-white transition ${items.length < 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}