import type { MetaFunction } from "remix";

import styles from "../styles/index/about.css";

import type { LinksFunction } from "remix";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let meta: MetaFunction = () => {
  return {
    title: "About",
  };
};

export default function About() {
  return (
    <>
      <h1 className="text-5xl">This is the about page</h1>
      <p className="mt-4 text-lg">There's really not much here</p>
    </>
  );
}
