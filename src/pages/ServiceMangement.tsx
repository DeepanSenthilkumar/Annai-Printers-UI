import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { toaster } from "../components/toaster";

type Service = {
  id: number;
  name: string;
};

type PageType = {
  id: number;
  name: string;
};

type Row = {
  id: number;
  service: string;
  pageType: string;
  cost: string;
};

const CONFIG_SERVICE_ID = 999;
const CONFIG_PAGE_ID = 888;

function ServiceMangement() {

  const [services, setServices] = useState<Service[]>([]);
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);

  const [serviceValue, setServiceValue] = useState("");
  const [pageValue, setPageValue] = useState("");
  const [costValue, setCostValue] = useState("");

  const [serviceInputMode, setServiceInputMode] = useState(false);
  const [pageInputMode, setPageInputMode] = useState(false);

  const [tableData, setTableData] = useState<Row[]>([]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [originalCost, setOriginalCost] = useState("");

  // const [errors, setErrors] = useState<any>({});

  useEffect(() => {

    // API call should be here

    const serviceList = [
      { id: 1, name: "Printing" },
      { id: 2, name: "Binding" },
      { id: CONFIG_SERVICE_ID, name: "Other" },
    ];

    const pageList = [
      { id: 1, name: "A4" },
      { id: 2, name: "A3" },
      { id: CONFIG_PAGE_ID, name: "Custom" },
    ];

    setServices(serviceList);
    setPageTypes(pageList);

  }, []);

  function validate() {
    let newErrors: any = {};

    if (!serviceValue.trim()) newErrors.service = "Service required";
    if (!pageValue.trim()) newErrors.page = "Page type required";

    if (!costValue.trim()) {
      newErrors.cost = "Cost required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(costValue)) {
      newErrors.cost = "Invalid cost format";
    }

    // setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function isDuplicate(service: string, page: string) {
    return tableData.some((row, i) => row.service === service && row.pageType === page && i !== editIndex);
  }

  const resetForm = () => {
    setServiceValue("");
    setPageValue("");
    setCostValue("");
    setServiceInputMode(false);
    setPageInputMode(false);
    setEditIndex(null);
    // setErrors({});
  }

  const addRow = () => {
    if (!validate()) {
      toaster.error('Please fill all details', "Error");
      return;
    } 

    if (isDuplicate(serviceValue, pageValue)) {
      toaster.warning('Service already exit', "Warning")
      return;
    }

    const newRow: Row = {
      id: Date.now(),
      service: serviceValue,
      pageType: pageValue,
      cost: costValue,
    };
    toaster.success('Service added successfully', "Success");
    setTableData([...tableData, newRow]);
    resetForm();
  }

  const handleEdit = (index: number, row: any) => {
    // const row = tableData[index];

    setServiceValue(row.service);
    setPageValue(row.pageType);
    setCostValue(row.cost);

    setOriginalCost(row.cost);

    // setServiceInputMode(true);
    // setPageInputMode(true);

    setEditIndex(index);
  }

  const handleUpdate = () => {
    if (!validate()) return;

    if (editIndex === null) return;

    const updated = [...tableData];
    updated[editIndex].cost = costValue;
    setTableData(updated);
    toaster.success("Updated successfully", "Success");
    resetForm();
  }

  const handleDelete = (index: number) => {
    const updated = tableData.filter((_, i) => i !== index);
    setTableData(updated);
    toaster.success('Service deleted', "Success");
    resetForm();
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-6">
          Service Management
        </h2>

        <div className="flex gap-4 items-end">

          {/* SERVICE */}

          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">Service</label>
            <div>
              {!serviceInputMode ? (

                <select className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" value={serviceValue} disabled={editIndex != null}
                  onChange={(e) => {
                    const selected = services.find(s => s.name === e.target.value);

                    if (selected?.id === CONFIG_SERVICE_ID) {
                      setServiceInputMode(true);
                      setServiceValue("");
                    } else {
                      setServiceValue(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input className="border p-2 w-full pr-8 focus:outline-none focus:ring-2 border-gray-300 rounded-md" value={serviceValue} onChange={(e) => setServiceValue(e.target.value)}/>

                  <span className="absolute right-2 top-2 cursor-pointer" onClick={() => {setServiceInputMode(false); setServiceValue("");}}>
                    ✕
                  </span>
                </div>
              )}

              {/* {errors.service && (<p className="text-red-500 text-sm">{errors.service}</p>)} */}
            </div>
          </div>

          {/* PAGE TYPE */}

          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">Page Type</label>
            <div>
              {!pageInputMode ? (
                <select className="border p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={pageValue} disabled={editIndex != null}
                  onChange={(e) => {
                    const selected = pageTypes.find(s => s.name === e.target.value);

                    if (selected?.id === CONFIG_PAGE_ID) {
                      setPageInputMode(true);
                      setPageValue("");
                    } else {
                      setPageValue(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Page</option>

                  {pageTypes.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input className="border p-2 w-full focus:outline-none focus:ring-2" value={pageValue} onChange={(e) => setPageValue(e.target.value)}/>

                  <span className="absolute right-2 top-2 cursor-pointer" onClick={() => {setPageInputMode(false); setPageValue("");}}>
                    ✕
                  </span>
                </div>
              )}

              {/* {errors.page && (<p className="text-red-500 text-sm">{errors.page}</p>)} */}
            </div>
          </div>

          {/* COST */}
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">Cost of page</label>
            <input className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2" value={costValue} placeholder="Enter cost of page"
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*(\.\d{0,2})?$/.test(val)) {
                  setCostValue(val);
                }
              }}
            />

            {/* {errors.cost && (<p className="text-red-500 text-sm">{errors.cost}</p>)} */}
          </div>

          {/* BUTTONS */}

          <div className="flex gap-2 w-auto">
            {editIndex === null ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 h-[43px]" onClick={addRow}>
                Add
              </button>
            ) : (
              <>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-200 h-[43px]" disabled={costValue === originalCost} onClick={handleUpdate}>
                  Update
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 h-[43px]" onClick={resetForm}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* TABLE */}

        {tableData.length > 0 && (
          <table className="w-full mt-8 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Page Type</th>
                <th className="p-2 border">Cost</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((row, i) => (
                <tr key={row.id}>
                  <td className="border p-2 text-center">{row.service}</td>
                  <td className="border p-2 text-center">{row.pageType}</td>
                  <td className="border p-2 text-center">{row.cost}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button className="flex items-center p-1 text-blue-500 text-sm hover:text-white hover:bg-blue-500 rounded-md" onClick={() => handleEdit(i, row)}>
                      <span className="material-icons text-[16px]">edit</span>
                    </button>

                    <button className="flex items-center p-1 text-red-500 text-sm hover:text-white hover:bg-red-500 rounded-md" onClick={() => handleDelete(i)}>
                      <span className="material-icons text-[16px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default ServiceMangement;