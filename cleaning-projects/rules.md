# Rules

In force from round 1. Change them together, before a new round starts, not on submission Sunday.

## Cycle

- **14 days, 8 tasks:** 3 easy, 3 medium, 2 hard.
- Each task counts on its own. Three solved easy tasks are three cleaning jobs, not one.
- Unsolved tasks expire at the end of the round. They are not carried over. The ideas come back later in a new story if the concept is still missing.

## Reward

Each level adds cleaning, so a short task does not cost the same work as a hard one.

| Difficulty | How many per round | He cleans, per solved task |
|------------|--------------------|----------------------------|
| Easy | 3 | Sink |
| Medium | 3 | Sink and toilet |
| Hard | 2 | The whole bathroom: sink, toilet, shower, floor, mirror |

Bathroom only. Kitchen, hallway, and the rest of the apartment are outside this deal.

**Bonus** (optional, written on each task): one extra job you name beforehand. If you cannot think of one, polishing the mirror is the default. A bonus does not count unless every must-item is done.

## Submission

**Sunday, 12:00**, live. A 14-day round has two Sundays. Whatever was accepted on the first Sunday is finished. On the second Sunday, only what actually runs still counts.

Round 1: Sunday **4 Oct 2026** and Sunday **11 Oct 2026**, each at 12:00. After that the round is closed.

She shows:

1. **Live demo.** The program runs on her machine, with inputs he picks, including the self-test in the task.
2. **Explain-check, about 5 minutes.** She explains the flow in her own words. He asks two questions, for example "What happens on this line?" and "Why this structure and not a plain list?". Code she cannot explain is not solved.

Google, docs, ChatGPT, and other AIs are allowed as study aids. Understanding is the currency. See [Getting started](getting-started.md) for what kind of question still leaves you able to explain the code.

## Solved

A task is solved when every must-item is met and the program does not crash. The must-list is the checklist, so Sunday is not a debate about taste.

A vague result ("something with the total") does not count. If the task has a self-test, the demo has to match it.

## Cleaning

He cleans by **the next Sunday, 12:00** after the task was accepted. She signs off with the same strictness as the explain-check: the named surfaces, finished, not a quick splash.

Several rewards of the same kind (two sinks, for example) are owed one after another. They are not merged into a single visit. When during the week he cleans is his choice, as long as the deadline holds.

## Tools

Details, commands, and terminal input/output: [Getting started](getting-started.md).

- **Java 21.** Check with `java --version` and `javac --version`.
- One folder per task. No `package` line, so `javac *.java` and `java Main` are enough.
- The task names the files. Each file owns one job. `Main.java` reads and prints. The other files do the work. One file that does everything is not solved.
- Web task: open `index.html` in a browser. Linux task: Bash in the terminal.
- An editor is fine. The demo still runs in the terminal or the browser, not as a screenshot.
