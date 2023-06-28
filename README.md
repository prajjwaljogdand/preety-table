# preety-table

Preety-Table is a lightweight Node package for pretty-printing tables on the command line in different styles


```
import table from "preety-table";

let data = [
  [123123,'Something awesome', 1000.00, 3],
  [245452, "Very interesting book", 11.45, 4],
  [345452, "Yet another product", 555.55, 5],
];

let header = ["id", "desc", "price", "rating"];

table.print(data, header, "c", [1,4], table.styles.ascii_thin_double);

```

produces
<!--pytest-codeblocks:expected-output-->
```
+--------------+-----------------------------+--------------+--------------+
|              |                             |              |              |
|      id      |            desc             |    price     |    rating    |
|              |                             |              |              |
+--------------+-----------------------------+--------------+--------------+
|              |                             |              |              |
|    123123    |      Something awesome      |     1000     |      3       |
|              |                             |              |              |
+--------------+-----------------------------+--------------+--------------+
|              |                             |              |              |
|    245452    |    Very interesting book    |    11.45     |      4       |
|              |                             |              |              |
+--------------+-----------------------------+--------------+--------------+
|              |                             |              |              |
|    345452    |     Yet another product     |    555.55    |      5       |
|              |                             |              |              |
+--------------+-----------------------------+--------------+--------------+
```
which is useful for copy-pasting into websites that support Markdown (like GitHub).

You can control border style, padding, alignment, and various other attributes. For
example,

If the styles in `preety-table.styles`
```
thin
thin_thick
thin_double
rounded
rounded_thick
rounded_double
thick
thick_thin
double
double_thin
booktabs

ascii_thin
ascii_thin_double
ascii_double
ascii_double_thin
ascii_booktabs

markdown
```
aren't good enough for you, simply provide your own
style as a string of length  11 or 15 (the extra 4 including header-separating
characters). For example

### License
This software is published under the [GPL-3.0
license](https://www.gnu.org/licenses/gpl-3.0.en.html).