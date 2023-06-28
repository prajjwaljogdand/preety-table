import table from "./index.js";

let data = [
  [123123,'Something awesome', 1000.00, 3],
  [245452, "Very interesting book", 11.45, 4],
  [345452, "Yet another product", 555.55, 5],
];
let header = ["id", "desc", "price", "rating"];

table.print(data, header, "c", [1,4], table.styles.ascii_booktabs);
table.print(data, header, "c", [1,4], table.styles.ascii_thin_double);
table.print(data, header, "c", [1,4], table.styles.ascii_thin);
table.print(data, header, "c", [1,4], table.styles.booktabs);
table.print(data, header, "c", [1,4], table.styles.double);
table.print(data, header, "c", [1,4], table.styles.rounded_double);
table.print(data, header, "c", [1,4], table.styles.rounded_thick);
table.print(data, header, "c", [1,4], table.styles.ascii_double);

