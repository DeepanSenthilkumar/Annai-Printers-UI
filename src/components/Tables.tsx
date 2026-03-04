import React from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  align?: "left" | "center" | "right";
  headerClassName?: string;
  cellClassName?: string; 
  render?: (row: T, index: number) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  headerClassName?: string;
};

export default function Tables<T extends object>({
  columns,
  data,
  headerClassName = "bg-gray-200 text-gray-700 text-sm",
}: TableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className={headerClassName}>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`p-3 text-${col.align || "left"} ${col.headerClassName || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-3 text-${col.align || "left"} ${col.cellClassName || ""}`}
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}