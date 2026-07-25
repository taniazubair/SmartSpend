import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", income: 70000, expense: 35000 },
  { month: "Feb", income: 72000, expense: 40000 },
  { month: "Mar", income: 68000, expense: 38000 },
  { month: "Apr", income: 80000, expense: 50000 },
  { month: "May", income: 76000, expense: 45000 },
  { month: "Jun", income: 82000, expense: 47000 },
];

function ExpenseChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[400px]">
      <h2 className="text-2xl font-bold mb-6">
        Income vs Expenses
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;