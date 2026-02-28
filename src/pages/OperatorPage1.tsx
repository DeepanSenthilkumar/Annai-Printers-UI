// import Layout from "../components/Layout";

// export default function OperatorPage1() {
//   return (
//     <Layout>
//       <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

//       <div className="grid grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-gray-600">Today's Jobs</h3>
//           <p className="text-2xl font-bold mt-2">18</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-gray-600">Completed</h3>
//           <p className="text-2xl font-bold mt-2">10</p>
//         </div>
//       </div>
//     </Layout>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useOperatorCart } from "../context/OperatorCartContext";

type ServiceItem = {
  service: string;
  pageType: string;
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

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

      {/* Dropdown Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="grid grid-cols-3 gap-6 items-end">
          {/* Service Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Service
            </label>
            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Page Type Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Page Type
            </label>
            <select
              value={selectedPageType}
              onChange={(e) => setSelectedPageType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Page Type</option>
              {pageTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <div>
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
          <table className="w-full">
            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">S.No</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Page Type</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.service}</td>
                  <td className="p-3">{item.pageType}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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