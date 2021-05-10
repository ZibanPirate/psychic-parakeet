import { Dispatch, StateInterface } from "src/redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import { FC } from "react";
import { SettingsState } from "src/redux/reducers/settings";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles(() =>
  createStyles({
    darkModeText: {
      flexGrow: 1,
    },
  }),
);

export const Navbar: FC = () => {
  const state = useSelector<StateInterface, StateInterface>((state) => state);
  const dispatch = useDispatch<Dispatch<SettingsState>>();
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Switch
          checked={state.settings.darkMode ? true : false}
          onChange={(input) => {
            dispatch({
              type: "UPDATE_SETTINGS",
              payload: { darkMode: input.target.checked },
            });
          }}
          name="darkMode"
          inputProps={
            // there is a bug in https://github.com/mui-org/material-ui/tree/next/packages/material-ui/src/Switch
            // i will probably open an issue for it, then fix it on an MR, the interface should be InputBaseComponentProps
            // instead of React.InputHTMLAttributes<HTMLInputElement>, so that it can allow arbitrary attributes such as "data-testid"
            {
              "data-testid": "dark-mode-switch",
            } as React.InputHTMLAttributes<HTMLInputElement>
          }
        />
        <div className={classes.darkModeText}>
          {state.settings.darkMode ? "🌙" : "🌞"}
        </div>
      </Toolbar>
    </AppBar>
  );
};
