import { createStyles, makeStyles } from "@material-ui/core/styles";
import { FC } from "react";
import { LandingPageState } from "src/redux/reducers/landing-page";
import { Navbar } from "src/components/navbar";
import { StateInterface } from "src/redux";
import { useSelector } from "react-redux";

const useStyles = makeStyles(() =>
  createStyles({
    searchContainer: {
      textAlign: "center",
    },
  }),
);

export const LandingPage: FC = () => {
  const classes = useStyles();
  const landingPageState = useSelector<StateInterface, LandingPageState>(
    (state) => state.landingPage,
  );

  return (
    <>
      <Navbar />
      <div className={classes.searchContainer}>
        <div>Search goes here</div>
        <div>
          Found {landingPageState.movies && landingPageState.movies.length}
        </div>
      </div>
    </>
  );
};

// for lazy-loading
export default LandingPage;
