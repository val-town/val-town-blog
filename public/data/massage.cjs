const Fs = require("fs");
const issues = require("./fastify-issues.json");

const i = issues.map((i, idx) => {
  const { Title, Completed } = i;
  return {
    idx,
    title: Title,
    completed: Completed,
  };
});

console.log(JSON.stringify(i, null, 2));
