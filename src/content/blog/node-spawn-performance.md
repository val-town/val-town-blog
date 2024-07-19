---
title: "Why is spawning a new processes in Node so slow?"
generated: 1701894028870
description: "At Val Town we spawn a lot of processes. We're working on making it faster"
author: Max McDonnell
pubDate: Jul 19, 2024
---

<style>
    table code { background-color: initial }
    table td, table th { padding: 0.5rem }
</style>

At Val Town we run your code in Deno processes. We recently noticed, that under
load, a single Val Town's Node server cannot exceed 40 spawns/s. It spends
30% of its time with the main thread blocked on calls to `spawn`. Why is it so
slow? Can we make it any faster?

To simulate this pattern we'll write an HTTP server that spawns a new process
for each request. Like this:

```js
import { spawn } from "node:child_process";
import http from "node:http";
http
.createServer((req, res) => spawn("echo", ["hi"]).stdout.pipe(res))
.listen(8001);
```

We'll write similar implementations in Go
([here](https://github.com/maxmcd/process-per-request/blob/fb2f5f9518d62f058f7e587580c302b56f7a5781/go/main.go))
and Rust
([here](https://github.com/maxmcd/process-per-request/blob/0a6442f656fe7bc8f6c61ef2c5fdef65c6afa0f1/rust/src/main.rs))
and run this example with Node, Deno and Bun.

I am running all of these on a Hetzner CCX33 with 8 vCPUs and 32 GB of ram. I am
benchmarking with [bombardier](https://github.com/codesenberg/bombardier)
running on the same machine. The command I'll run to benchmark each server is
`bombardier -c 30 -n 10000 http://localhost:8001`. 10,000 total requests over 30
connections. I prewarm each server before running the benchmark. I'm using Go
v1.22.2, Rust v1.77.2, Node v22.3.0, Bun 1.1.20, and Deno 1.44.2.

Here are the results:

| Language/Runtime | Req/s | Command                            |
| ---------------- | ----- | ---------------------------------- |
| Node             | 651   | `node baseline.js`                 |
| Deno             | 2,290 | `deno run --allow-all baseline.js` |
| Bun              | 2,208 | `bun run baseline.js`              |
| Go               | 5,227 | `go run go/main.go`                |
| Rust (tokio)     | 5,466 | `cd rust && cargo run --release`   |

Ok, so Node is slow. Deno and Bun have figured out how to make this faster, and
the compiled, thread-pool languages are much faster again.

Node's `spawn` performance does seem to be notably bad. [This
thread](https://github.com/nodejs/node/issues/14917) was an interesting read,
and while in my testing things have improved since the time of that post, Node
still spends an awful lot of time blocking the main thread for each Spawn call.

Switching to Bun or Deno would improve this a lot. That is great to know, but
let's try and improve things with Node.

## Node `cluster` Module

The simplest thing we can do spawn more processes and run an http server
per-process using Node's `cluster` module. Like so:

```js
import { spawn } from "node:child_process";
import http from "node:http";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";

if (cluster.isPrimary) {
  for (let i = 0; i < availableParallelism(); i++) cluster.fork();
} else {
  http
    .createServer((req, res) => spawn("echo", ["hi"]).stdout.pipe(res))
    .listen(8001);
}
```

Node shares the network socket between processes here, so all of our processes
can listen on `:8001` and they'll be routed requests round-robin.

The main issue with this approach for me is that each HTTP server is isolated in
it's own process. This can complicate things if you manage any kind of in-memory
caching or global state that needs to be shared between these processes. I'd
ideally find a way to keep the single thread execution model of javascript and
still make spawns fast.

Here are the results:

| Language/Runtime | Req/s | Command                                      |
| ---------------- | ----- | -------------------------------------------- |
| Node             | 1,766 | `node cluster.js`                            |
| Deno             | 2,133 | `deno run --allow-all cluster.js`            |
| Bun              | n/a   | "node\:cluster is not yet implemented in Bun" |

Super weird. Deno is slower, Bun doesn't work just yet, and Node has improved
a lot, but I would have expected it to be even faster.

Nice to know there is some speedup here. We'll move on from it for now.

## Move The Spawn Calls To Worker Threads

If the `spawn` calls are blocking the main thread, let's move them to worker
threads.

Here's our `worker-threads/worker.js` code. We listen for messages with a
command and an id. We run it and post the result back. We're using `execFile`
here for convenience, but it is just an abstraction on top of `spawn`.

```js
import { execFile } from "node:child_process";
import { parentPort } from "node:worker_threads";

parentPort.on("message", (message) => {
  const [id, cmd, ...args] = message;

  execFile(cmd, args, (_error, stdout, _stderr) => {
    parentPort.postMessage([id, stdout]);
  });
});
```

And here's our `worker-threads/index.js`. We create 8 worker threads. When we
want to handle a request we send a message to a thread to make the spawn call
and send back the output. Once we get the response back, we respond to the http
request.

```js
import assert from "node:assert";
import http from "node:http";
import { EventEmitter } from "node:events";
import { Worker } from "node:worker_threads";

const newWorker = () => {
  const worker = new Worker("./worker-threads/worker.js");
  const ee = new EventEmitter();
  // Emit messages from the worker to the EventEmitter by id.
  worker.on("message", ([id, msg]) => ee.emit(id, msg));
  return { worker, ee };
};

// Spawn 8 worker threads.
const workers = Array.from({ length: 8 }, newWorker);
const randomWorker = () => workers[Math.floor(Math.random() * workers.length)];

const spawnInWorker = async () => {
  const worker = randomWorker();
  const id = Math.random();
  // Send and wait for our response.
  worker.worker.postMessage([id, "echo", "hi"]);
  return new Promise((resolve) => {
    worker.ee.once(id, (msg) => {
      resolve(msg);
    });
  });
};

http
  .createServer(async (_, res) => {
    let resp = await spawnInWorker();
    assert.equal(resp, "hi\n"); // no cheating!
    res.end(resp);
  })
  .listen(8001);
```

Results!

| Language/Runtime | Req/s | Command                                        |
| ---------------- | ----- | ---------------------------------------------- |
| Node             | 426   | `node worker-threads/index.js`                 |
| Deno             | 3,601 | `deno run --allow-all worker-threads/index.js` |
| Bun              | 2,898 | `bun run worker-threads/index.js`              |

Node is slower! Ok, so presumably we are not bypassing Node's bottleneck by
using threads. So we're doing the same work with the added overhead of
coordinating with the worker threads. Bummer.

Deno loves this, and Bun likes it a little more. Generally, it's nice to see
that Bun and Deno don't see much of an improvement here. They're already doing a
good job of keeping the sycall overhead off of the execution thread.

Onward.

## Move Spawn Calls to Child Processes

If threads are not going to work, let's use child processes to do the work.
We're spawning processes to spawn processes, but we'll spawn a small number of
worker processes from the main thread and distribute work between them. This way
we only pay the spawn cost on startup in the main thread.

This is quite easy. We simply swap out the worker threads for processes spawned
by `child_process.fork` and change how we send and receive messages.

```diff
$ git diff --unified=1 --no-index ./worker-threads/ ./child-process/
diff --git a/./worker-threads/index.js b/./child-process/index.js
index 52a93fe..0ed206e 100644
--- a/./worker-threads/index.js
+++ b/./child-process/index.js
@@ -3,6 +3,6 @@ import http from "node:http";
 import { EventEmitter } from "node:events";
-import { Worker } from "node:worker_threads";
+import { fork } from "node:child_process";

 const newWorker = () => {
-  const worker = new Worker("./worker-threads/worker.js");
+  const worker = fork("./child-process/worker.js");
   const ee = new EventEmitter();
@@ -21,3 +21,3 @@ const spawnInWorker = async () => {
   // Send and wait for our response.
-  worker.worker.postMessage([id, "echo", "hi"]);
+  worker.worker.send([id, "echo", "hi"]);
   return new Promise((resolve) => {
diff --git a/./worker-threads/worker.js b/./child-process/worker.js
index 5f025ca..9b3fcf5 100644
--- a/./worker-threads/worker.js
+++ b/./child-process/worker.js
@@ -1,5 +1,4 @@
 import { execFile } from "node:child_process";
-import { parentPort } from "node:worker_threads";

-parentPort.on("message", (message) => {
+process.on("message", (message) => {
   const [id, cmd, ...args] = message;
@@ -7,3 +6,3 @@ parentPort.on("message", (message) => {
   execFile(cmd, args, (_error, stdout, _stderr) => {
-    parentPort.postMessage([id, stdout]);
+    process.send([id, stdout]);
   });
```

Nice. And the results:

| Language/Runtime | Req/s | Command                                       |
| ---------------- | ----- | --------------------------------------------- |
| Node             | 2,209 | `node child-process/index.js`                 |
| Deno             | 3,800 | `deno run --allow-all child-process/index.js` |
| Bun              | 3,871 | `bun run worker-threads/index.js`             |


Good speedups all around. I am very curious what the bottleneck is that is
preventing Deno and Bun from getting to Rust/Go speeds. Please let me know if
you have suggestions for how to dig into that!

One fun thing here is that we can mix Node and Bun. Bun implements the Node IPC
protocol, so we can configure Node to spawn Bun child processes. Let's try that.

Update the `fork` arguments to use the `bun` binary instead of Node.
```js
const worker = fork("./child-process/worker.js", {
  execPath: "/home/maxm/.bun/bin/bun",
});
```

| Language/Runtime | Req/s | Command                       |
| ---------------- | ----- | ----------------------------- |
| Node + Bun       | 3,853 | `node child-process/index.js` |

Hah, cool. I get to use Node on the main thread and leverage Bun's performance.


## Stdio

Logs. The previous implementations assume there will be minimal log output, but
what if there's a lot? We could send the logs using `process.send`, but that
will be quite expensive if our output bytes are serialized to JSON.

I spent a lot of time in this rabbit hole. Here's a rough summary of the things
I tried:

1. Passing file descriptors between processes. Like passing the stdout/err back
   up to the parent process. I tried this a few different ways but couldn't get
   it working so that we'd always capture all the bytes written.
2. Just using `process.send`. This works, but is only performant if you use
   `serialization: "advanced"` so that you can send bytes without serialization.
   This doesn't work in Deno and Bun.
3. I created a pair of [Abstract
   Sockets](https://man7.org/linux/man-pages/man7/unix.7.html#:~:text=be%20inspected.%0A%0A%20%20%20%20%20%20%20abstract-,an%20abstract%20socket,-address%20is%20distinguished) for each spawn
   call and sent the logs over the socket. This spends too much time setting up
   the sockets to be worth it.

Also Abstract Sockets are crazy. I'm familiar with [Unix Domain
Sockets](https://en.wikipedia.org/wiki/Unix_domain_socket) where you have a file
called (eg) `something.sock` and you can listen on it and connect to it just
like a network address. Turns out, that if you use a Unix socket and the
filename starts with a null byte, like `\0foo` the socket will not exist on the
filesystem and it'll be automatically removed when no longer used. Weird! Cool!

After all this testing I have two approaches that work pretty well.

1. Set up a pool of processes with `.fork()` and also set up a separate abstract
   socket for each one to send logs.
2. Simply use `process.send` but use `serialization: "advanced"`.

Let's see how those work out.

We'll need something that outputs a lot of logs. So I grabbed the `main.c` file
from Sqlite's source. This is a 163Kb file. We'll run the command `cat main.c`
to print it out.

Here's our `baseline.js` again with that update:
```ts
import { spawn } from "node:child_process";
import http from "node:http";
http
  .createServer((_, res) => spawn("cat", ["main.c"]).stdout.pipe(res))
  .listen(8001);
```

I've updated the Go and Rust code as well. Let's see how they do:

| Language/Runtime | Req/s | Command                            |
| ---------------- | ----- | ---------------------------------- |
| Node             | 374   | `node baseline.js`                 |
| Deno             | 667   | `deno run --allow-all baseline.js` |
| Bun              | 1,374 | `bun run baseline.js`              |
| Go               | 2,757 | `go run go/main.go`                |
| Rust (tokio)     | 3,535 | `cd rust && cargo run --release`   |


Fascinating. It's cool to see Bun and Rust pull ahead here compared to the
previous benchmarks. Node is still slow very slow and Deno is surprisingly
unhappy with this workload.

Next let's try my abstract socket communication channel implementation. It's
getting quite complex so I won't post it here, but you can [take a look
here](https://github.com/maxmcd/process-per-request/tree/7528cd8045c998c8b5451961e0818473b4a81860/child-process-comm-channel).

| Language/Runtime | Req/s | Command                                                    |
| ---------------- | ----- | ---------------------------------------------------------- |
| Node             | 1,336 | `node child-process-comm-channel/index.js`                 |
| Node + Bun       | 2,635 | `node child-process-comm-channel/index.js`                 |
| Deno             | 862   | `deno run --allow-all child-process-comm-channel/index.js` |
| Bun              | 1,833 | `bun child-process-comm-channel/index.js`                  |

Haha. I had seen some random benchmark results where Node+Bun was faster than
bun alone, but it never netted out in the final runs.

The Deno results are quite perplexing. In implementing this example I had a
"bug" where I was buffering the response as a string. Here's the diff of me fixing it:

```diff
@@ -88,9 +88,8 @@ const spawnInWorker = async (res) => {
   worker.child.send([id, "spawn", ["cat", ["main.c"]]]);
-  let resp = "";
   worker.ee.on(id, (msg, data) => {
     if (msg == MessageType.STDOUT) {
-      resp += data.toString();
+      res.write(data);
     }
     if (msg == MessageType.STDOUT_CLOSE) {
-      res.end(resp);
+      res.end();
       worker.requests -= 1;
```

This 'fix' makes Deno a lot slower, but Node and Bun a lot faster! I wonder if
that's because one has a faster `toString()` implementation or higher overhead for
`res.write`?


| Language/Runtime     | Req/s | Command                                                    |
| -------------------- | ----- | ---------------------------------------------------------- |
| Deno + string buffer | 1,453 | `deno run --allow-all child-process-comm-channel/index.js` |

Weird!

Finally, here is the `process.send` implementation. It is fast and also
incredibly simple to implement. I am a little unexcited about this solution
because it is slower than I'd like, doesn't support Deno and Bun, and there's
very little space to improve things. However, this implementation is deeply
practical and easy to understand, which is beautiful. Here's the source of
`worker.js`, the rest [is here](https://github.com/maxmcd/process-per-request/tree/7528cd8045c998c8b5451961e0818473b4a81860/child-process-send-logs).

```ts
import { spawn } from "node:child_process";
import process from "node:process";

process.on("message", (message) => {
  const [id, cmd, ...args] = message;
  const cp = spawn(cmd, args);
  cp.stdout.on("data", (data) => process.send([id, "stdout", data]));
  cp.stderr.on("data", (data) => process.send([id, "stderr", data]));
  cp.on("close", (code, signal) => process.send([id, "exit", code, signal]));
});
```

| Language/Runtime | Req/s | Command                                       |
| ---------------- | ----- | --------------------------------------------- |
| Node             | 1,179   | `node child-process-send-logs/index.js` |

Very nice, probably the practical choice if you are only targeting Node.

## Load Balancing

A quick note on load balancing between processes. Both Go and Rust [have
complicated schedulers](https://rakyll.org/scheduler/) that [distribute work
efficiently](https://tokio.rs/blog/2019-10-scheduler). So far, when picking a
worker I've been grabbing a random one:

```ts
const workers = await Promise.all(Array.from({ length: 8 }, newWorker));
const randomWorker = () => workers[Math.floor(Math.random() * workers.length)];
```

However, we can also implement round-robin, and least-connections style load
balancing. [See a wonderful writeup on those
here](https://samwho.dev/load-balancing/).

```ts
const pickWorkerInOrder = () => workers[(count += 1) % workers.length];
const pickWorkerWithLeastRequests = () =>
  workers.reduce((selectedWorker, worker) =>
    worker.requests < selectedWorker.requests ? worker : selectedWorker
  );
```

Sadly I didn't see consistent performance improvements with these approaches.
They all perform about the same. Maybe more typical workloads where the spawn
calls are not entirely uniform would benefit more from these changes.

## Library?

It seems possible, given all of these findings, to implement a `child_process`
library that implements the same API surface as `node:child_process` but farms
the spawn calls out to a process pool. Maybe I will write that, or maybe you
will. Please [let me know](https://x.com/mxmcd) if there's interest.

## Final Thoughts

We're sadly at the limits of my knowledge/experimentation, but I wonder what
could unlock more performance.

It was really fun to see improved performance and what didn't, and the random
moments where Deno/Bun/Node were affected differently.

Using Node and Bun together is a fun pattern and it's nice to see it lead to
such a speedup. Please support Node's IPC Deno!

Let me know if there's anything else I should experiment with here! See you next
time :)