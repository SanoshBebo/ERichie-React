import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Container, Paper, Typography } from "@mui/material";

const ShopSalesBarChart = (data) => {
  return (
    <div className="max-h-screen flex-row items-center justify-center">
      <Container maxWidth="md" className="mt-10 p-10">
        <Paper elevation={6}>
          <Typography variant="h5" className="p-3" align="center" gutterBottom>
            Shop Sales Bar Chart
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.shopSalesData}>
              <XAxis dataKey="shop" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default ShopSalesBarChart;
