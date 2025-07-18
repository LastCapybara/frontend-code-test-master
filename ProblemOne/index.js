var arr = [
  {
    guest_type: "crew",
    first_name: "Marco",
    last_name: "Burns",
    guest_booking: {
      room_no: "A0073",
      some_array: [7, 2, 4],
    },
  },
  {
    guest_type: "guest",
    first_name: "John",
    last_name: "Doe",
    guest_booking: {
      room_no: "C73",
      some_array: [1, 3, 5, 2, 4, 3],
    },
  },
  {
    guest_type: "guest",
    first_name: "Jane",
    last_name: "Doe",
    guest_booking: {
      room_no: "C73",
      some_array: [1, 3, 5, 2, 4, 3],
    },
  },
  {
    guest_type: "guest",
    first_name: "Albert",
    last_name: "Einstein",
    guest_booking: {
      room_no: "B15",
      some_array: [2, 5, 6, 3],
    },
  },
  {
    guest_type: "crew",
    first_name: "Jack",
    last_name: "Daniels",
    guest_booking: {
      room_no: "B15",
      some_array: [2, 5, 6, 3],
    },
  },
  {
    guest_type: "guest",
    first_name: "Alan",
    last_name: "Turing",
    guest_booking: {
      room_no: "B15",
      some_array: [2, 5, 6, 3],
    },
  },
];

function mutateArray(a) {
  function flatObj(obj) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && obj !== null && !Array.isArray(value)) {
        Object.assign(result, flatObj(value));
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  const flatArr = a.map((el) => flatObj(el));

  const countedArr = flatArr.map(({ some_array, ...rest }) => ({
    ...rest,
    some_total: some_array.reduce((acc, num) => acc + num, 0),
  }));

  const filteredArr = countedArr.filter((item) => item.guest_type === "guest");

  const sortedArr = filteredArr.sort((a, b) => {
    const lastNameCoparison = a.last_name.localeCompare(b.last_name);
    if (lastNameCoparison !== 0) {
      return lastNameCoparison;
    }

    return a.first_name.localeCompare(b.first_name);
  });

  return sortedArr;
}

$(document).ready(function () {
  $("#originalArray").html(JSON.stringify(arr, null, 2));
  $("#resultsArray").html(JSON.stringify(mutateArray(arr), null, 2));
});
