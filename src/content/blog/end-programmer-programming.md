---
title: End-programmer Programming
generated: 1701894028842
description: A reflection on the goal of making programming for everyone.
pubDate: November 8, 2022
author: Steven Krouse
---

The dream of “end-user programming” is still too far away. Let’s set our sights on “end-programmer programming” first.

## The Dream

There is a dream, almost an ancient prophecy, about computers that is as old as computers themselves. Like a siren song, the dream has lured thousands of us to chase it. It shimmers like a mirage, tantalizingly just over the horizon, yet remains as elusive now as it ever has been. The road to the dream is littered with so many dead prototypes of brilliant minds that many have given up on the dream entirely. Yet in [some hearts](http://futureofcoding.org) the dream lives on.

The dream is that the full power of computers be accessible to all, that our digital worlds will be as moldable as clay in our hands, shaped fluidly and continuously to serve each of our unique and particular needs. The dream is that the full expressivity of programming will be accessible to all people, not just the ~1% who spends years learning to code. The dream is the nothing short of [the real computer revolution](http://www.vpri.org/pdf/m2007007a_revolution.pdf). The dream is **end-user programming**.

> \[End-user programming is] a vision for empowered computing pursued by bright-eyed computer science visionaries. Its rich history reaches back to the 1960s with programming environments like Smalltalk and Logo. Notable successes since then include Unix, the spreadsheet, Hypercard, and HTML. And today, newcomers like Zapier, Coda, and Siri Shortcuts are trying their own approaches to automation and dynamic modeling.

- [End-user Programming](https://www.inkandswitch.com/end-user-programming/) (Ink & Switch)

>

## Boiling the ocean

The gulf between end-user software and end-user programming is filled with an ocean of thorny problems:

1. Understanding basic programming concepts (boolean logic, statements, state, loops, functions)
2. Using formal syntax
3. Setting up a development environment
4. Rendering
5. Deployment, hosting, logging, monitoring
6. Version control
7. Persistence (databases)

There are many amazing products and research prototypes that solve some of these problems. There’s visual programming to make programming concepts more intuitive, structured editors to help prevent syntax errors, auto-install online coding environments, WYSIWYG rendering tools, and more! (Check out the [Whole Code Catalog](https://futureofcoding.org/catalog/) for a selected list.)

Trying to tackle all of these problems at once is like trying to boil the ocean. Yet only focusing on a sliver of the problem doesn’t come anywhere close to the original dream. The wary dreamer must somehow chart a path from here, the world of today, that can bring us ever close to the whole dream.

## End-programmer programming

We can shift the audience. Instead of trying to achieve end-**\*\*\*\***user**\*\*\*\*** programming, let’s start with end-********\*\*\*\*********programmer********\*\*\*\********* programming. Today not even professional programmers can control their own software! How can we expect to get from here to end-user programming, without first achieving end-programmer programming?

At work, the programmer is a magician. She is just keystrokes away from anything she can dream up. But at home, using apps made by big companies, programmers are disenfranchised serfs, just like everyone else.

The task of end-programmer programming is empowering programmers to actually control the software they use in their lives; not just the software they write for work.

## Liberal software

We already have free & open-source software. So what is stopping us programmers from achieving the dream of end-programmer programming?

> Imagine if you wanted to change how GitHub works. If you had the source, all you would need to do would be to reproduce GitHub's entire infrastructure in your basement, make your changes, and convince all of your friends to use the result. Or you could somehow get GitHub to allow you to make the change. The latter is generally easier, and points out another failing in the four freedoms \[of [free software](https://www.gnu.org/philosophy/free-sw.en.html)]. Freedom 3 is the right to distribute modified versions to others, but, in this world, it's not necessarily access to the source that enables this freedom. Instead, it's access to the runtime environment.

- [From free software to liberal software](https://lwn.net/Articles/712376/) (Jonathan Corbet)

>

End-programmers need access to the deployed runtime environment, what Robert "r0ml" Lefkowitz calls [“liberal software”](https://lwn.net/Articles/712376/).

Liberal software is also a pre-requisite to end-user programming! And that’s the point of end-programmer programming: it’s a pit stop that allows us to solve some of the same problems we’ll have to solve for end-user programming, but without having to deal with non-programmers at the same time.

The problems of liberal software are a tarball all on their own:

1. Mapping between different data schemas between versions of code ([Cambria](https://www.inkandswitch.com/cambria/))
2. Managing code sharing between a Cambrian explosion of branches
3. Permissions for which users get to control what

We can limit the scope yet again: eschew whole, multiplayer apps in favor of small, personal, [folk](https://maggieappleton.com/folk-interfaces) software, little integrations, and mini-apps, like [Spotify Rediscover](https://rile.yt/rediscover), [Alert HN](https://alerthn.com/), [HN Replies](https://hnreplies.com/), and [Small World](https://smallworld.kiwi/).

## An experiment: HN Follow

Because of excellent, free APIs and a sparse core interface, Hacker News has spawned a whole ecosystem of mini-apps from readers to push-notifiers. Inspired by our friend [Kartik](http://akkartik.name/)’s use-case, we decided to contribute our own mini-app to the fray, built in the end-programmer style.

Our mini-app is called HN Follow ([hnfollow.com](http://hnfollow.com)) and it allows you to “follow” authors on Hacker News and get email notifications whenever they post. Our “app” really isn’t even an app at all: it just walks you through creating the scripts to set up this query poll job.

![Screen Shot 2022-11-08 at 2.23.32 PM.png](./end-programmer-programming/screen_shot_2022-11-08_at_22332_pm.png)

Once setup, you can customize any of the JavaScript: write your own query, choose a different schedule, filter results, format the email alert differently, etc. You can even use the basic polling & email architecture to query any source via its API, not just Hacker News.

Importantly, all this code is hosted and run for you. This is what makes it liberal software: you have access to deploy to the same runtime the code was written in.

When you sign up for HN Follow, we create an account for you on [Val Town](https://val.town) (👋 disclaimer: this is my new startup, a collaborative cloud scripting environment) and install the scripts there.

## Val Town

[Val Town](https://val.town) is a place to write and run code online. You can think of it as a “runnable Github Gists” or a “user-friendly AWS Lambda”. It makes it incredibly easy to email yourself, persist small pieces of data, expose functions and API endpoints, and create a recurring jobs.

[https://www.loom.com/share/878294970d8e48919c819f35d0cd0da4](https://www.loom.com/share/878294970d8e48919c819f35d0cd0da4)

It’s a JavaScript editor and runtime built for the cloud: collaborative, persistent, and (eventually) [connected to APIs](https://twitter.com/stevekrouse/status/1557746449600991232). Use it to keep tabs on Hacker News or your other favorite watering holes, reserve a table at a hot new restaurant, or shuffle data between one SaaS app and another.

But the dream of Val Town is nothing short of end-user programming, with a little detour through end-programmer programming. Come join as we inch along towards the dream!

🙏 *Thanks Karik Agaram, Sam Arbesman, Geoffrey Litt, Dan Levine, Rodrigo Tello, and André Terron for your contributions to this piece, HN Follow, and Val Town!*

## Subscribe

The easiest way to subscribe to Val Town is to **sign up for an account on [val.town](http://val.town)**, and then opting in to receive our newsletter as your set your username. You can also sign up [via this link](https://cdn.forms-content.sg-form.com/6c6893f3-38e6-11ed-b573-a6c391c68d4b).
