import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";


export default function Layout() {
  return (
    <>
      <div>
        
      <Navbar/>
        <Outlet />
      </div>
    </>
  );
}



// import { Outlet, Navigate } from "react-router-dom";

// export default function AdminLayout() {
//   const token = localStorage.getItem("token"); // Or from context
//   const role = localStorage.getItem("role");   // Must be 'Admin'

//   if (!token || role !== "Admin") {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div>
//       <Navbar />
//       <Outlet />
//     </div>
//   );
// }
