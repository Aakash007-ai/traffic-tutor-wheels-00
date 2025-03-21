import { useState, useEffect } from "react";

const ZebraCrossing = () => {
  const [stripeCount, setStripeCount] = useState(10);
  const [stripeHeight, setStripeHeight] = useState(20);

  useEffect(() => {
    const updateStripes = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setStripeCount(8);
        setStripeHeight(12);
      } else if (width < 768) {
        setStripeCount(12);
        setStripeHeight(16);
      } else if (width < 1024) {
        setStripeCount(17);
        setStripeHeight(20);
      } else {
        setStripeCount(25);
        setStripeHeight(24);
      }
    };

    updateStripes();
    window.addEventListener("resize", updateStripes);
    return () => window.removeEventListener("resize", updateStripes);
  }, []);

  return (
    <div className="w-[95] h-30 flex flex-row gap-3 items-center mx-2">
      {[...Array(stripeCount)].map((_, index) => (
        <div
          key={index}
          className="w-full h-20 bg-white"
          style={{
            backgroundColor: "white",
          }}
        ></div>
      ))}
    </div>
  );
};

export default ZebraCrossing;
