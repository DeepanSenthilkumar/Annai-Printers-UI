import Layout from "../components/Layout";

export default function AdminPage1() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Orders" value="152" />
        <Card title="Revenue" value="₹1,24,000" />
        <Card title="Pending Jobs" value="12" />
      </div>
    </Layout>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}