import React from "react";
import { Skeleton } from "@material-ui/lab";
const CardSkeleton = () => {
  return (
    <Skeleton
      animation="wave"
      style={{ margin: "1% 1%" }}
      variant="rect"
      width="10vw"
      height="6vh"
    />
  );
};

export default CardSkeleton;
