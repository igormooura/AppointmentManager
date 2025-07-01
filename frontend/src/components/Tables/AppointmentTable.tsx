import { Table } from "./Table";
import { TableRow } from "./TableRow";
import { Appointment } from "../../types/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  loading: { fetch: boolean; updateId: string };
  updateStatus: (id: string, status: "confirmed" | "canceled") => void;
  formatDateTime: (dateStr: string, hourStr: string) => { date: string; time: string };
}

const headers = ["Patient", "Contact", "Specialty", "Date", "Time", "Status", "Actions"];

export const AppointmentTable = ({
  appointments,
  loading,
  updateStatus,
  formatDateTime,
}: AppointmentTableProps) => {
  if (loading.fetch) return <div>Loading...</div>;
  if (appointments.length === 0) return <div>No appointments found</div>;

  return (
    <Table headers={headers}>
      {appointments.map((appt) => (
        <TableRow
          key={appt._id}
          appt={appt}
          loadingId={loading.updateId}
          onUpdateStatus={updateStatus}
          formatDateTime={formatDateTime}
        />
      ))}
    </Table>
  );
};