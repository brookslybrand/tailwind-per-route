import { Outlet } from "react-router-dom";
import type { MetaFunction } from "remix";

import styles from "../styles/routes/index.css";

import type { LinksFunction } from "remix";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let meta: MetaFunction = () => {
  return {
    title: "Home",
  };
};

export default function Index() {
  return (
    <main className="m-4 p-4 border-[16px] border-green-300">
      <Outlet />
    </main>
  );
}
