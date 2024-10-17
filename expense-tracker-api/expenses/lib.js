const { DateTime } = require("luxon");

// Function to dynamically calculate date ranges
const getDateRanges = () => {
  const today = DateTime.now();

  return {
    pastWeek: {
      $gte: today.minus({ weeks: 1 }).startOf("day").toJSDate(),
      $lt: today.endOf("day").toJSDate(),
    },
    pastMonth: {
      $gte: today.minus({ months: 1 }).startOf("day").toJSDate(),
      $lt: today.endOf("day").toJSDate(),
    },
    last3Months: {
      $gte: today.minus({ months: 3 }).startOf("day").toJSDate(),
      $lt: today.endOf("day").toJSDate(),
    },
    custom: {
      validate: (startDate, endDate) => {
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for custom range"
          );
        }

        const start = DateTime.fromISO(startDate);
        const end = DateTime.fromISO(endDate);

        if (!start.isValid || !end.isValid) {
          throw new Error("Invalid date format");
        }

        if (start > end) {
          throw new Error("Start date cannot be greater than end date");
        }

        return {
          $gte: start.startOf("day").toJSDate(),
          $lt: end.endOf("day").toJSDate(),
        };
      },
    },
  };
};

module.exports = {
  getDateRanges,
};