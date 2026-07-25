import {
  FiShoppingBag,
  FiCoffee,
  FiHome,
  FiFilm,
} from "react-icons/fi";

const transactions = [
  {
    title: "Starbucks",
    amount: "-Rs.650",
    date: "Today",
    icon: FiCoffee,
  },
  {
    title: "Grocery",
    amount: "-Rs.5,200",
    date: "Yesterday",
    icon: FiShoppingBag,
  },
  {
    title: "Electricity Bill",
    amount: "-Rs.3,000",
    date: "18 Jul",
    icon: FiHome,
  },
  {
    title: "Netflix",
    amount: "-Rs.1,100",
    date: "17 Jul",
    icon: FiFilm,
  },
];

function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Recent Transactions
      </h2>

      <div className="space-y-5">

        {transactions.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">

                  <Icon className="text-blue-600 text-xl" />

                </div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.date}
                  </p>

                </div>

              </div>

              <span className="font-bold text-red-500">
                {item.amount}
              </span>

            </div>
          );

        })}

      </div>

    </div>
  );
}

export default RecentTransactions;