import AdminBox from "@/components/AppointmentBox/AdminBox"
import Background from "@/components/Background/Background"
import Header from "@/components/Header/Header"

const AdminPage : React.FC = () => {
    return(
        <Background>
            <Header/>
            <AdminBox/>
        </Background>
    )
}

export default AdminPage