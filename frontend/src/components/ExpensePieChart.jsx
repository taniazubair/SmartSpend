import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Food", value: 12000 },
  { name: "Shopping", value: 9000 },
  { name: "Bills", value: 6000 },
  { name: "Transport", value: 4000 },
  { name: "Entertainment", value: 5000 },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function ExpensePieChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 h-[400px]">

      <h2 className="text-2xl font-bold mb-6">
        Expense Categories
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ExpensePieChart;
<div className="grid lg:grid-cols-2 gap-8 mt-8">

  <ExpensePieChart />

  <RecentTransactions />

</div>