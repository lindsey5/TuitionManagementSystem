type PurpleTableProps = {
    columns: string[];
    data: any[];
    className?: string; 
};

const PurpleTable = ({ columns, data, className = 'hidden md:block h-full overflow-y-auto' }: PurpleTableProps) => {
    return (
        <div className="min-h-0 flex-grow w-full md:bg-white md:shadow-sm rounded-lg border border-gray-200">
        <div className={className}>
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
                    className={`hover:bg-purple-200 transition ${index % 2 === 0 && 'bg-purple-50'}`}
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
        <div className="block md:hidden flex flex-col gap-4 p-4">
            {data.map((row, index) => (
                <div
                    key={index}
                    className="w-full bg-white rounded-2xl shadow-md p-6 shadow-xl transition-all duration-300 border-l-4 border-purple-500"
                >
                    {/* Content */}
                    <div className="flex flex-col gap-3">
                        {columns.map((column, idx) => (
                            <div 
                                key={column} 
                                className={`${idx === 0 ? 'pb-3 mb-2 border-b-2 border-gray-100' : ''}`}
                            >
                                <div className={`${idx === 0 ? 'mb-1' : 'flex items-center gap-2'}`}>
                                    <span className={`${
                                        idx === 0 
                                            ? 'text-xs font-semibold text-purple-600 uppercase tracking-wider' 
                                            : 'text-xs text-gray-500 flex-shrink-0 w-28'
                                    }`}>
                                        {column}
                                    </span>
                                    {idx !== 0 && (
                                        <span className="text-sm font-semibold text-gray-800 flex-1 text-right">
                                            {row[column]}
                                        </span>
                                    )}
                                </div>
                                {idx === 0 && (
                                    <p className="text-lg font-bold text-gray-900">
                                        {row[column]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default PurpleTable;
