import type { MetaFunction } from "remix";

import styles from "../styles/404.css";

import type { LinksFunction } from "remix";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour() {
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}
