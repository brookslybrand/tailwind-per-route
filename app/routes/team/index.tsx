import styles from "../../styles/routes/team/index.css";

import type { LinksFunction } from "remix";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let meta = () => {
  return {
    title: "Team",
  };
};

export default function Team() {
  return (
    <h1 className="text-4xl py-4 text-center">
      Select a team member to get started
    </h1>
  );
}
