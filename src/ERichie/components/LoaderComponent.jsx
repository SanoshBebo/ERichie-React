import { Box, CircularProgress } from "@mui/material";
import React from "react";

const LoaderComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="font-bold text-3xl p-5">Loading Sales Report</h1>
        <CircularProgress className="p=5" />
      </Box>
    </div>
  );
};

export default LoaderComponent;
