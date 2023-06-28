import styles from "./styles.js";
import assert from "assert";
import chalk from "chalk";

const print = (data, ...args) => {
  console.log(to_string(data, ...args));
};

const _colorize = (data) => {
  return chalk.blue(data);
};

const createPaddingTuple = (padding) => {
  let out;
  if (typeof padding === "number") {
    out = [padding, padding, padding, padding];
  } else {
    if (padding.length == 1) {
      out = [padding[0], padding[0], padding[0], padding[0]];
    } else if (padding.length == 2) {
      out = [padding[0], padding[1], padding[0], padding[1]];
    } else if (padding.length == 3) {
      out = [padding[0], padding[1], padding[2], padding[1]];
    } else {
      assert(padding.length == 4, "padding is wrong");
      out = [padding[0], padding[1], padding[2], padding[3]];
    }
  }

  return out;
};

const createAlignment = (alignment, numCol) => {
  if (alignment.length === 1) {
    alignment = alignment.repeat(numCol);
  }
  assert(alignment.length === numCol, "wrong  alignment specified");
  return alignment;
};

function _remove_escape_sequences(string) {
  // https://stackoverflow.com/a/14693789/353337
  return string.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]/g, "");
}

const getColumnWidths = (strings, numCol) => {
  let widths = Array(numCol).fill(0);
  for (let row of strings) {
    for (let i = 0; i < row.length; i++) {
      let item = row[i];
      let width = _remove_escape_sequences(item).length;
      widths[i] = Math.max(widths[i], width);
    }
  }

  return widths;
};

const _align = (string, alignments, colWidth) => {
  for (let row of string) {
    row.forEach((item, k) => {
      let align = alignments[k];
      let width = colWidth[k];
      let rest = width - _remove_escape_sequences(item).length;
      let left, right;
      if (rest === 0) row[k] = item;
      else {
        if (align === "l") {
          left = 0;
        } else if (align === "r") {
          left = rest;
        } else {
          assert(align === "c");
          left = Math.floor(rest / 2);
        }

        right = rest - left;
        row[k] = " ".repeat(left) + item + " ".repeat(right);
      }
    });
  }

  return string;
};

const _add_padding = (strings, colWidth, padding) => {
  for (let row of strings) {
    row.forEach((item, k) => {
      let width = colWidth[k] + padding[1] + padding[3];
      let s = [];
      for (let i = 0; i < padding[0]; i++) {
        s.push(" ".repeat(width));
      }
      s.push(" ".repeat(padding[3]) + item + " ".repeat(padding[1]));
      for (let i = 0; i < padding[2]; i++) {
        s.push(" ".repeat(width));
      }
      row[k] = s.join("\n");
    });
  }

  return strings;
};

const _hjoin = (join_char, strings) => {
  let cstrings = strings.map((item) => item.split("\n"));
  let max_num_lines = Math.max(...cstrings.map((item) => item.length));
  let pp = [];
  for (let i = 0; i < max_num_lines; i++) {
    let p = cstrings.map((cstring) => cstring[i]);
    pp.push(
      _colorize(join_char) + p.join(_colorize(join_char)) + _colorize(join_char)
    );
  }

  return pp.map((p) => p.trimRight()).join("\n");
};


/**
 * Converts data into table and make it string
 * @param {*} data
 * @param {*} header
 * @param {*} alignment
 * @param {*} padding
 * @param {*} style
 * @returns out "string of data in table"
 */

const to_string = (
  data,
  header = null,
  alignment = "l",
  padding = [0, 1],
  style = styles.thin_double
) => {
  //   console.log(data, header, alignment, padding, style);

  let num_columns = data[0].length;
  assert(header.length === data[0].length, "unequal shape");
  for (let row of data) assert(row.length === num_columns, "unequal shape");

  if (header) data = [header, ...data];
  const padding_tuple = createPaddingTuple(padding);
  const alignments = createAlignment(alignment, num_columns);

  let border_chars, block_sep_chars;

  if (!style) {
    border_chars, (block_sep_chars = undefined), undefined;
  } else {
    if (style.length === 11) {
      border_chars = style;
      block_sep_chars = [
        border_chars[6],
        border_chars[0],
        border_chars[10],
        border_chars[7],
      ];
    } else {
      assert(style.length === 15);
      border_chars = style.slice(0, 11);
      block_sep_chars = style.slice(11);
    }
  }
  let strings = data.map((block) => block.map((row) => row.toString()));
  let colWidth = getColumnWidths(strings, num_columns);
  let colWidthWithPadding = colWidth.map(
    (width) => width + padding_tuple[1] + padding_tuple[3]
  );
  strings = _align(strings, alignments, colWidth);
  strings = _add_padding(strings, colWidth, padding_tuple);

  let join_char = border_chars[1];

  strings.forEach((row, k) => {
    strings[k] = _hjoin(join_char, row);
  });
  let intermediate_border_row;
  if (border_chars) {
    let bc = border_chars;
    let cwp = colWidthWithPadding;
    let word = cwp.map((s) => bc[0].repeat(s));
    intermediate_border_row =
      "\n" + _colorize(bc[6]) + word.join(bc[10]) + _colorize(bc[7]) + "\n";
  } else {
    intermediate_border_row = "\n";
  }

  strings = strings.join(_colorize(intermediate_border_row));

  // # remove empty lines
  // out = "\n".join([s for s in out.splitlines() if s.strip()])
  let first_border_row, last_border_row;
  if (border_chars) {
    let bc = border_chars;
    let cwp = colWidthWithPadding;
    let word = cwp.map((s) => bc[0].repeat(s));
    first_border_row =
      _colorize(bc[2]) + word.join(bc[8]) + _colorize(bc[3]) + "\n";
    last_border_row =
      "\n" + _colorize(bc[4]) + word.join(bc[9]) + _colorize(bc[5]);
  } else {
    first_border_row = "";
    last_border_row = "";
  }

  let out = _colorize(first_border_row) + strings + _colorize(last_border_row);

  out = out
    .split("\n")
    .filter((s) => s.trim())
    .join("\n");

  return out;
};

const table = { print, styles };
export default table;
