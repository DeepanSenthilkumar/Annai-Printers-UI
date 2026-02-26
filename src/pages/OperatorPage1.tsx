import Layout from "../components/Layout";

export default function OperatorPage1() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600">Today's Jobs</h3>
          <p className="text-2xl font-bold mt-2">18</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600">Completed</h3>
          <p className="text-2xl font-bold mt-2">10</p>
        </div>
      </div>
    </Layout>
  );
}