const Dashboard = () => {
  const cards = [
    {
      title: "Distributor information",
      values: [
        { title: "Name", value: "Victor Ibironke" },
        { title: "Package", value: "Executive" },
        { title: "Username", value: "victoribironke" },
      ],
    },
    {
      title: "Binary points",
      values: [
        { title: "Total left BV - Total right BV", value: "260.00 - 1,675.00" },
        {
          title: "Available left BV - Available right BV",
          value: "10.00 - 1,420.00",
        },
        { title: "Rank advancement bonus", value: "0.00" },
      ],
    },
    {
      title: "Wallet",
      values: [
        { title: "Currency", value: "Naira" },
        { title: "E-wallet", value: "31.52" },
        { title: "Transaction wallet", value: "5,219.00" },
      ],
    },
    {
      title: "Bonuses",
      values: [
        { title: "Referral bonus", value: "1,123,424.00" },
        { title: "Rollup bonus", value: "1,424.00" },
      ],
    },
    {
      title: "Bonuses",
      values: [
        { title: "Kick start bonus", value: "23,600.00" },
        { title: "Binary bonus", value: "3,920.00" },
      ],
    },
    {
      title: "Bonuses",
      values: [
        { title: "Unilevel bonus", value: "0.00" },
        { title: "Cheque match bonus", value: "63.63" },
      ],
    },
    {
      title: "Bonuses",
      values: [
        { title: "Rank", value: "Achiever" },
        { title: "Rank advancement bonus", value: "0.00" },
      ],
    },
    {
      title: "Data",
      values: [
        { title: "Sponsored / Activated", value: "14 / 21" },
        { title: "Personal BV", value: "0.00" },
      ],
    },
    {
      title: "Award qualification",
      values: [
        { title: "Awards won", value: "No awards yet" },
        { title: "Next award", value: "50,000" },
      ],
    },
    {
      title: "Award points",
      values: [
        { title: "Total left BV -  Total right BV", value: "0.0 - 16.22" },
        { title: "Accumulated award points", value: "310.00" },
      ],
    },
    {
      title: "Total bonuses earned",
      values: [
        { title: "Total", value: "0.0" },
        { title: "Referral link", value: "*referral link*" },
      ],
    },
  ];

  return (
    <section className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {cards.map((c, i) => (
        <div key={i} className="border rounded-md overflow-hidden">
          <div className="w-full text-center p-2 font-semibold text-main bg-gray-100">
            {c.title}
          </div>

          {c.values.map((v, j) => (
            <div
              className="p-2 border-t flex items-center justify-between flex-col"
              key={j}
            >
              <p className="whitespace-nowrap text-lg font-medium text-mai">
                {v.value}
              </p>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                {v.title}
              </p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Dashboard;
