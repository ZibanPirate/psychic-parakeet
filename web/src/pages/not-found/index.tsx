import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import { FC } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  image: {
    marginTop: theme.spacing(4),
    width: "80%",
    maxWidth: "600px",
  },
  text: {
    padding: theme.spacing(4),
  },
}));

export const NotFoundPage: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Link to="/">
        <Button startIcon={<ArrowBackIcon />} size="large">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
