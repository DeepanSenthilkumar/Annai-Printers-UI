import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { toaster } from "../components/toaster";
import Tables, { Column } from "../components/Tables";
import Select from "react-select";
import { ApiService } from "../api/services";

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
  serviceId: string;
  pageType: string;
  pageId: string;
  cost: string;
};

type Option = {
  value: number;
  label: string;
};

type ServiceAPI = {
  _id: string;
  serviceId: string;
  pageTypeId: string;
  serviceName: string;
  pageType: string;
  costPerPage: number;
};

// const CONFIG_SERVICE_ID = 999;
// const CONFIG_PAGE_ID = 888;

const OTHER_ID = 7;

function ServiceMangement() {
  const columns: Column<Row>[] = [
    {header: "Service", accessor: "service", align: "center"},
    {header: "Page Type", accessor: "pageType", align: "center"},
    {header: "Cost", accessor: "cost", align: "center"},
    {header: "Actions", accessor: "id", align: "center",
      render: (_row: Row, index: number) => (
        <div className="flex gap-2 justify-center">
          <button className="flex items-center p-1 text-blue-500 text-sm hover:text-white hover:bg-blue-500 rounded-md" onClick={() => handleEdit(index, tableData[index])}>
            <span className="material-icons text-[16px]">edit</span>
          </button>

          <button className="flex items-center p-1 text-red-500 text-sm hover:text-white hover:bg-red-500 rounded-md" onClick={() => handleDelete(index)}>
            <span className="material-icons text-[16px]">delete</span>
          </button>
        </div>
      )
    }
  ];

  const [apiServices, setApiServices] = useState<ServiceAPI[]>([]);
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

    // const serviceList = [
    //   { id: 1, name: "Printing" },
    //   { id: 2, name: "Binding" },
    //   { id: CONFIG_SERVICE_ID, name: "Other" },
    // ];

    // const pageList = [
    //   { id: 1, name: "A4" },
    //   { id: 2, name: "A3" },
    //   { id: CONFIG_PAGE_ID, name: "Custom" },
    // ];

    // setServices(serviceList);
    // setPageTypes(pageList);

    getService();

  }, []);

  const getService = async () => {
    debugger
    try {

      const res = await ApiService.getAllService();

      if(res?.isAdded){
        const data:ServiceAPI[] = res.services || [];
        setApiServices(data);

        if(data.length === 0){
          setTableData([]);
          setServices([{id:OTHER_ID,name:"Other"}]);
          setPageTypes([{id:OTHER_ID,name:"Other"}]);
          return;
        }

        const tableRows:Row[] = data.map((s,index)=>({
          id:index+1,
          service:s.serviceName,
          serviceId:s.serviceId,
          pageType:s.pageType,
          pageId: s.pageTypeId,
          cost:String(s.costPerPage)
        }));

        setTableData(tableRows);

        const uniqueServices = [...new Set(data.map(s=>s.serviceName))];

        const serviceOptions = uniqueServices.map((name,i)=>({
          id:i+1,
          name
        }));

        serviceOptions.push({id:OTHER_ID,name:"Other"});
        setServices(serviceOptions);
      }

    } catch (error) {
      toaster.error("Failed to fetch services","Error");
    }
  }

  const serviceOptions: Option[] = services.map(s => ({
    value: s.id,
    label: s.name
  }));

  const pageOptions: Option[] = pageTypes.map(p => ({
    value: p.id,
    label: p.name
  }));

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

  const addRow = async () => {
    if (!validate()) {
      toaster.error('Please fill all details', "Error");
      return;
    } 

    if (isDuplicate(serviceValue, pageValue)) {
      toaster.warning('Service already exit', "Warning")
      return;
    }

    const payload = {
      serviceName: serviceValue,
      pageType: pageValue,
      costPerPage: Number(costValue)
    };

    try{
      const response = await ApiService.createNewService(payload);
      if (response.isAdded) {
        toaster.success('Service added successfully', "Success");
        getService();
        resetForm();
      }
    } catch (err) {
      console.log(err)
    }
    // setTableData([...tableData, newRow]);
  }

  const handleEdit = (index: number, row: any) => {
    debugger
    // const row = tableData[index];
    setServiceValue(row.service);
    setPageValue(row.pageType);
    setCostValue(row.cost);

    setOriginalCost(row.cost);

    // setServiceInputMode(true);
    // setPageInputMode(true);

    setEditIndex(index);
    const filtered = apiServices.filter(s => s.serviceName === row.service);

    const uniquePages = [...new Set(filtered.map(f => f.pageType))];

    const pages = uniquePages.map((p, i) => ({
      id: i + 1,
      name: p
    }));

    pages.push({ id: OTHER_ID, name: "Other" });

    setPageTypes(pages);
  }

  const handleUpdate = async () => {
    debugger
    if (!validate()) return;

    if (editIndex === null) return;
    debugger
    const pageTypeId = tableData[editIndex].pageId

    const requestBody = {
      "costPerPage": Number(costValue)
    }

    console.log(requestBody)

    try {
      const response = await ApiService.updateServiceDetails(pageTypeId, requestBody);
      
      if(response.isAdded) {
        toaster.success("Updated successfully", "Success");
        getService();
        resetForm();
      }
    } catch (err) {
      console.log('err', err);
    }
  }

  const handleDelete = async (index: number) => {
    const pageTypeId = tableData[index].pageId
    try{
      const response = await ApiService.deleteService(pageTypeId);

      if(response.isAdded) {
        getService();
        resetForm();
        toaster.success('Service deleted', "Success");
      }
    } catch (err) {
      toaster.error("Can't delete the service. Please try again", "Error");
    }
  }

  const handleServiceChange = (option: Option | null) => {
    if (!option) {
      setServiceValue("");
      return;
    }

    if (option.value === OTHER_ID) {
      setServiceInputMode(true);
      setServiceValue("");
      setPageTypes([{id:OTHER_ID,name:"Other"}]);
    } else {
      const selectedService = option.label;
      setServiceValue(selectedService);
      const filtered = apiServices.filter(s=>s.serviceName===selectedService);
      const uniquePages = [...new Set(filtered.map(f=>f.pageType))];
      const pages = uniquePages.map((p,i)=>({id:i+1,name:p}));
      pages.push({id:OTHER_ID,name:"Other"});
      setPageTypes(pages);
    }
  };

  const handlePageChange = (option: Option | null) => {
    if (!option) {
      setPageValue("");
      return;
    }

    if (option.value === OTHER_ID) {
      setPageInputMode(true);
      setPageValue("");
    } else {
      setPageValue(option.label);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-6">
          Service Management
        </h2>

        <div className="flex gap-4 items-end">
          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">Service</label>
            <div>
              {!serviceInputMode ? (

                <Select options={serviceOptions} value={serviceOptions.find(o => o.label === serviceValue) || null} onChange={handleServiceChange} 
                  isDisabled={editIndex !== null} isClearable placeholder="Select Service"/>
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

          <div className="flex flex-col w-1/4">
            <label className="block text-sm font-medium mb-2">Page Type</label>
            <div>
              {!pageInputMode ? (
                <Select options={pageOptions} value={pageOptions.find(o => o.label === pageValue) || null} onChange={handlePageChange}
                 isDisabled={editIndex !== null} isClearable placeholder="Select Page Type"/>
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

        {tableData.length > 0 && (
          <div className="mt-8">
            <Tables<Row> columns={columns} data={tableData}/>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ServiceMangement;