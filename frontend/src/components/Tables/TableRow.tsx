import { Appointment } from "../../types/appointment";
import { ActionButtons } from "./ActionButtons";
import { StatusBadge } from "./StatusBadge";

interface TableRowProps {
  appt: Appointment;
  loadingId: string;
  onUpdateStatus: (id: string, status: "confirmed" | "canceled") => void;
  formatDateTime: (dateStr: string, hourStr: string) => { date: string; time: string };
}

export const TableRow = ({ appt, loadingId, onUpdateStatus, formatDateTime }: TableRowProps) => {
  const { date, time } = formatDateTime(appt.date, appt.hour);
  const isUpdating = loadingId === appt._id;

  return (
    <tr key={appt._id} className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-3">
        <div className="font-medium">
          {appt.name} {appt.lastName}
        </div>
      </td>
      <td className="p-3 text-gray-600">{appt.email}</td>
      <td className="p-3 capitalize">{appt.specialty}</td>
      <td className="p-3">{date}</td>
      <td className="p-3">{time}</td>
      <td className="p-3">
        <StatusBadge status={appt.status} />
      </td>
      <td className="p-3 space-x-2">
        <ActionButtons 
          status={appt.status}
          isUpdating={isUpdating}
          onConfirm={() => onUpdateStatus(appt._id, "confirmed")}
          onCancel={() => onUpdateStatus(appt._id, "canceled")}
        />
      </td>
    </tr>
  );
};