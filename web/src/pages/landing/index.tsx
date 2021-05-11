import { Dispatch, StateInterface } from "src/redux";
import { FC, useRef } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { LandingPageState } from "src/redux/reducers/landing-page";
import { Navbar } from "src/components/navbar";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { debounce } from "@material-ui/core";
import { searchMoviesThunk } from "src/redux/actions/landing-page";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchContainer: {
      textAlign: "center",
    },
    usernameField: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "80%",
      maxWidth: 300,
    },
    movieSearchRoot: {
      padding: theme.spacing(1),
      display: "flex",
      maxWidth: 400,
      margin: "auto",
      marginTop: theme.spacing(2),
    },
    movieSearchInput: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    resultsContainer: {
      padding: theme.spacing(1),
      position: "relative",
      minHeight: "50vh",
    },
    resultsCard: {
      margin: "auto",
      marginTop: theme.spacing(1),
      maxWidth: 500,
    },
    media: {
      height: 300,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      position: "absolute",
    },
  }),
);

export const LandingPage: FC = () => {
  const classes = useStyles();
  const { searchQuery, errorMessage, movies, isFetching } = useSelector<
    StateInterface,
    LandingPageState
  >((state) => state.landingPage);
  const dispatch = useDispatch<Dispatch<LandingPageState>>();

  const { current: fetchMovies } = useRef(
    debounce(() => {
      console.log(Math.random());
      dispatch(searchMoviesThunk());
    }, 500),
  );

  const hideErrorMessage = () => {
    dispatch({
      type: "UPDATE_LANDING_PAGE",
      payload: { errorMessage: "" },
    });
  };

  return (
    <>
      {/* NavBar Section */}
      <Navbar />

      {/* Input Section */}
      <div className={classes.searchContainer}>
        {/* Search Field */}
        <Paper component="form" className={classes.movieSearchRoot}>
          <InputBase
            className={classes.movieSearchInput}
            placeholder="Search Movies"
            value={searchQuery}
            onChange={(input) => {
              dispatch({
                type: "UPDATE_LANDING_PAGE",
                payload: { searchQuery: input.target.value as string },
              });

              fetchMovies();
            }}
            inputProps={{ "data-testid": "search-field" }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      {/* Results Section */}
      <div className={classes.resultsContainer}>
        {movies.length > 0
          ? movies.map((movie, index) => (
              <Card
                key={`movie-${index}`}
                className={classes.resultsCard}
                variant="outlined"
              >
                {movie.poster && movie.poster.startsWith("http") && (
                  <CardMedia className={classes.media} image={movie.poster} />
                )}
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {movie.title}
                  </Typography>
                  <Typography color="textSecondary">{movie.plot}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    href={`https://www.google.com/search?q=${movie.title}`}
                    target="_blank"
                    size="small"
                    variant="outlined"
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            ))
          : "Nothing to show yet."}
        <Backdrop
          className={classes.backdrop}
          open={isFetching}
          data-testid={`loading-backdrop-${isFetching ? "open" : "closed"}`}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      {/* Notification Section */}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={hideErrorMessage}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={hideErrorMessage}
            data-testid="notification-close-button"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

// for lazy-loading
export default LandingPage;
