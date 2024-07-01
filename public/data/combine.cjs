const Fs = require("fs");
const express = require("./express.json");
const fastify = require("./fastify.json");
const hono = require("./hono.json");

const dates = [];
const series = [];

let e = [];
express.downloads.forEach((d) => {
  dates.push(d.day);
  e.push(d.downloads);
});

series.push(dates);
series.push(e);
e = [];

hono.downloads.forEach((d) => {
  e.push(d.downloads);
});

series.push(e);
e = [];

fastify.downloads.forEach((d) => {
  e.push(d.downloads);
});

series.push(e);
e = [];

Fs.writeFileSync("./series.json", JSON.stringify(series));

// console.log(series);
