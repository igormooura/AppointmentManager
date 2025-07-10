import { ReactNode } from "react";

interface TableProps {
    headers: string[];
    children: ReactNode
}

export const Table = ({headers, children}: TableProps) => {
    return(
        <div className= "overflow-x-auto">
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                        {headers.map((header) => (
                            <th key={header} className="p-3 border-b">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
};