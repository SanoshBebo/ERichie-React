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
import Legend from "./Legend";

const ShopSalesBarChart = (data) => {
  return (
    <div className="max-h-screen flex items-center justify-center">
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
      <div className="mt-10 p-10 border bg-gray-100 mr-52">
        <h1 className="font-bold text-center px-2 p-2">Legends</h1>
        <p className=" text-center px-2">X-Axis: ShopID</p>
        <p className="text-center px-2">Y-Axis: Earnings</p>
        <h1 className="font-bold text-center p-2">Key</h1>

        <Legend shopid={"shop01"} shopname={"Cosmic-Media-Gadgets"} />
        <Legend shopid={"shop02"} shopname={"E-Nerd"} />
        <Legend shopid={"shop03"} shopname={"Vishal Media Shop"} />
        <Legend shopid={"shop04"} shopname={"Supreme-Mart"} />
        <Legend shopid={"shop05"} shopname={"Dead-Eye-GameStore"} />
        <Legend shopid={"shop06"} shopname={"Lasya-Gaming"} />
        <Legend shopid={"shop07"} shopname={"Thillai-Gaming"} />
        <Legend shopid={"shop09"} shopname={"Shank-Mobiles"} />
        <Legend shopid={"shop10"} shopname={"Lemon-Tech"} />
        <Legend shopid={"shop11"} shopname={"E-Mobile"} />
        <Legend shopid={"shop12"} shopname={"Mobile-World"} />
        <Legend shopid={"shop13"} shopname={"Abhiram-Store"} />
        <Legend shopid={"shop14"} shopname={"Digital-Genie"} />
        <Legend shopid={"shop15"} shopname={"Sanjay-Computers"} />
        <Legend shopid={"shop16"} shopname={"Dhanu-Computers"} />
        <Legend shopid={"shop17"} shopname={"MrComputerWizz"} />
      </div>
    </div>
  );
};

export default ShopSalesBarChart;
