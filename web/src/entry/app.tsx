import "./style.scss";

import { ComponentType, FC, Suspense, lazy } from "react";
import { Route, RouteProps, Switch, } from "react-router-dom";
import { Loading } from "src/components/loading";
import { Theme } from "src/components/theme";

interface RouteInterface extends RouteProps {
  import: Promise<{ default: ComponentType }>;
}

const routes: RouteInterface[] = [
  {
    import: import("src/pages/landing"),
    path: "/",
    exact: true,
  },
  {
    import: import("src/pages/not-found"),
  },
];

export const App: FC = () => {
  return (
    <Theme>
      <Suspense fallback={<Loading />}>
        <Switch>
          {routes.map((route, index) => (
            <Route
              {...route}
              key={`route-${index}`}
              component={lazy(() => route.import)}
            />
          ))}
        </Switch>
      </Suspense>
    </Theme>
  );
};
