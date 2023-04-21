const express = require("express");
const { z } = require("zod");
const app = express();

const PORT = 5000;
let isProcessing = false;
let result;

app.use(express.json());

app.get("/", (_, res) => {
  if (isProcessing || !result) return res.json({ status: "pending" });
  res.json({ result, status: "complete" });
});

app.post("/", checkPostData, (req, res) => {
  if (isProcessing)
    return res.status(400).json({ status: "server is busy!!!" });

  isProcessing = true;
  new Promise((resolve) =>
    setTimeout(() => resolve(shiftBy(req.body.array, req.body.n)), 5000)
  ).then((data) => {
    isProcessing = false;
    result = data;
  });

  res.json({ status: "request accepted" });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// use zod for input validation
const postData = z.object({
  array: z.array(
    z.number({ invalid_type_error: "element in array should be a number" }),
    {
      required_error: "array is required",
      invalid_type_error: "array should be an array of numbers",
    }
  ),
  n: z.number({
    required_error: "n is required",
    invalid_type_error: "n should be a number",
  }),
});

function checkPostData(req, res, next) {
  try {
    postData.parse(req.body);
    next();
  } catch (e) {
    return res.status(400).json({ error: e.issues?.[0]?.message ?? e.message });
  }
}

function shiftBy(arr, shift) {
  // The solution below runs at time complexity of O(n) (worst case if shift = n)
  if (arr.length <= 1) return arr;

  shift = shift % arr.length;
  let i = 0;
  if (shift > 0) {
    while (i < shift) {
      arr.unshift(arr.pop());
      i++;
    }
  } else if (shift < 0) {
    while (i > shift) {
      arr.push(arr.shift());
      i--;
    }
  }
  return arr;
}
