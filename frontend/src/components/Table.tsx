type PurpleTableProps = {
    columns: string[];
    data: any[];
    classname?: string; 
};

const PurpleTable = ({ columns, data, classname = 'className="hidden md:block max-h-screen overflow-y-auto"' }: PurpleTableProps) => {
    return (
        <div className="w-full bg-white shadow-sm rounded-lg border border-gray-200">
        {/* ✅ Desktop / Tablet View */}
        <div className={classname}>
            <table className="min-w-full border-collapse">
            <thead className="bg-purple-600 text-white text-left text-sm font-medium sticky top-0">
                <tr>
                {columns.map((column) => (
                    <th key={column} className="py-3 px-4">
                    {column}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                <tr
                    key={index}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                    {columns.map((column) => (
                    <td key={column} className="py-3 px-4 text-sm">
                        {row[column]}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* ✅ Mobile View */}
        <div className="block md:hidden divide-y divide-gray-200">
            {data.map((row, index) => (
            <div
                key={index}
                className="p-4 hover:bg-gray-50 transition flex flex-col gap-2"
            >
                {columns.map((column) => (
                <div key={column} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{column}:</span>
                    <span className="text-gray-800">{row[column]}</span>
                </div>
                ))}
            </div>
            ))}
        </div>
        </div>
    );
};

export default PurpleTable;
