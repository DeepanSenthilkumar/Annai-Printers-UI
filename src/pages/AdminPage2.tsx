import Layout from "../components/Layout";

export default function AdminPage2() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-4">John</td>
            <td className="p-4">Operator</td>
            <td className="p-4 text-green-600">Active</td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}