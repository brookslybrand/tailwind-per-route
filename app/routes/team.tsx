import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";
import { json, useRouteData } from "remix";

import { APP_BAR_HEIGHT } from "../components/nav-bar";

import type { LoaderFunction } from "remix";

import styles from "../styles/routes/team.css";

import type { LinksFunction } from "remix";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

// This API comes from the free "Learn GraphQL with Apollo" tutorials
export const baseURL = `https://odyssey-lift-off-rest-api.herokuapp.com`;

export type TeamMember = {
  id: string;
  name: string;
  photo: string;
};

export let loader: LoaderFunction = async () => {
  const response = await fetch(`${baseURL}/tracks`);
  const data = await response.json();

  // get all of the unique authors
  const authorIds = new Set(
    data.map(({ authorId }: { authorId: string }) => {
      return authorId;
    })
  );
  const members = await Promise.all(
    Array.from(authorIds).map(async (authorId) => {
      const response = await fetch(`${baseURL}/author/${authorId}`);
      const { id, name } = (await response.json()) as TeamMember;
      return { id, name };
    })
  );

  return json(members);
};

export default function TeamLayout() {
  const team = useRouteData<Omit<TeamMember, "photo">[]>();

  return (
    <div
      className="fixed overflow-hidden w-full flex"
      style={{ height: `calc(100% - ${APP_BAR_HEIGHT})` }}
    >
      <aside
        className={clsx(
          "px-4 py-6 bg-gray-300 relative h-full overflow-y-auto max-w-max"
        )}
      >
        <nav>
          <ul className="space-y-2">
            {team.map(({ id, name }) => (
              <li key={id}>
                <NavLink
                  to={`/team/${id}`}
                  className="text-lg font-bold tracking-wide text-gray-800 hover:text-blue-800"
                  activeClassName="text-blue-600"
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
