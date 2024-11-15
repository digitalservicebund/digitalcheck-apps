import { Outlet } from "@remix-run/react";
import SupportBanner from "components/SupportBanner";

export default function Digitaltauglichkeit() {
  return (
    <>
      <Outlet />
      <SupportBanner />
    </>
  );
}
