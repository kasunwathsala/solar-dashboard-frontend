import { Outlet } from "react-router";
// import Navigation from "../components/Navigation/Navigation"

const RootLayout = () => {
  return (
    <>
      {/* <Navigation /> */}
      <Outlet />
    </>
  );
};

export default RootLayout;
