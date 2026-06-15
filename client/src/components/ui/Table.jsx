export default function DataTable({ columns, data, emptyMessage = 'No items found.' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-rose-100 bg-rose-50/50">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item._id || idx} className="border-b border-rose-50 hover:bg-rose-50/30">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="p-6 text-center text-gray-400">{emptyMessage}</p>}
    </div>
  );
}
