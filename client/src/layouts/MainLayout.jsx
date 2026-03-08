import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout({ theme, setTheme }) {
  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <Outlet />
    </>
  );
}

export default MainLayout;
