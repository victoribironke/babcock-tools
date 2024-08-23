const Dashboard = () => {
  // const cards = [
  //   {
  //     title: "Total bonuses earned",
  //     values: [
  //       { title: "Total", value: "0.0" },
  //       { title: "Referral link", value: "*referral link*" },
  //     ],
  //   },
  // ];

  return (
    <section className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {/* {cards.map((c, i) => (
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
      ))} */}
    </section>
  );
};

export default Dashboard;
