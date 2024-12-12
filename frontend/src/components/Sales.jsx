import React, { useEffect, useState } from "react";
import Topnav from "./templates/Topnav";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

function Sales() {
  const [salesData, setSalesData] = useState({
    totalIncome: 0,
    membershipCounts: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    },
    totalPaidMoney: 0,
    totalUnpaidMoney: 0,
  });

  const { totalIncome, membershipCounts, totalPaidMoney, totalUnpaidMoney } =
    salesData;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Topnav title="Sales" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        {/* Total Income */}
        <Card className="p-4 border border-green-100 bg-green-50">
          <div className="flex items-center gap-4">
            <CurrencyDollarIcon className="h-10 w-10 text-green-500" />
            <div>
              <Typography variant="h6">Total Income</Typography>
              <Typography className="text-gray-700 font-bold">
                ${totalIncome.toLocaleString()}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Total Paid Money */}
        <Card className="p-4 border border-blue-100 bg-blue-50">
          <div className="flex items-center gap-4">
            <CurrencyDollarIcon className="h-10 w-10 text-blue-500" />
            <div>
              <Typography variant="h6">Total Paid Money</Typography>
              <Typography className="text-gray-700 font-bold">
                ${totalPaidMoney.toLocaleString()}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Total Unpaid Money */}
        <Card className="p-4 border border-red-100 bg-red-50">
          <div className="flex items-center gap-4">
            <CurrencyDollarIcon className="h-10 w-10 text-red-500" />
            <div>
              <Typography variant="h6">Total Unpaid Money</Typography>
              <Typography className="text-gray-700 font-bold">
                ${totalUnpaidMoney.toLocaleString()}
              </Typography>
            </div>
          </div>
        </Card>

        {/* Membership Counts */}
        <Card className="p-4 border border-gray-200 bg-white">
          <Typography variant="h6" className="mb-4 font-bold text-center">
            Membership Counts
          </Typography>
          <div className="space-y-2">
            {Object.entries(membershipCounts).map(([tier, count]) => (
              <div
                key={tier}
                className="flex justify-between text-gray-700 border-b pb-2 last:border-b-0"
              >
                <span>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Sales;
