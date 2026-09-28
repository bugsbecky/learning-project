# Task 5 — Calendar conflicts

| | |
|---|---|
| Difficulty | Medium |
| Category | Puzzle |
| Reward | Sink and toilet |
| Time | about 4–7 hours |

## The problem

A calendar has to say which meetings overlap, and where the day still has room. Back to back is allowed: one meeting until 11:00 and the next from 11:00 is not a conflict. This is the interview problem "Merge Intervals," with clock times.

## Where it lives

```text
cleaning-projects/solutions/05-calendar/
  Main.java           reads lines and prints the two reports
  Appointment.java    start and end in minutes, parses HH:MM
  Schedule.java       sort, overlapping pairs, free windows
```

```bash
javac *.java
java Main
```

`"14:30"` is `14 * 60 + 30 = 870` minutes since midnight. A meeting from 10:00 to 11:00 occupies `[600, 660)`: 600 included, 660 not included. They overlap only when each starts before the other ends: `aStart < bEnd && bStart < aEnd`. Using `<=` makes 11:00 a false conflict.

## Normal use

Free windows are inside 08:00–20:00. Times you type can sit inside that day.

```text
1) Add  2) Conflicts  3) Free  4) Quit
> 1
Start (HH:MM): 09:00
End (HH:MM): 10:30
> 1
Start (HH:MM): 10:00
End (HH:MM): 11:00
> 1
Start (HH:MM): 11:00
End (HH:MM): 12:00
> 1
Start (HH:MM): 13:00
End (HH:MM): 14:00
> 2
09:00-10:30 overlaps 10:00-11:00
> 3
08:00-09:00
12:00-13:00
14:00-20:00
> 4
```

There is no conflict between 10:00–11:00 and 11:00–12:00, and none between 11:00–12:00 and 13:00–14:00. There is also no free slot between 10:30 and 12:00: that stretch is busy even though not every pair is a conflict.

Sort with a comparator, not with swaps written for exactly these four meetings:

```java
appointments.sort((a, b) -> Integer.compare(a.startMinutes, b.startMinutes));
```

You need to be able to say what `a` and `b` are. The sort lives in `Schedule`.

## Edge cases

A bad appointment is not stored.

```text
> 1
Start (HH:MM): 24:00
End (HH:MM): 25:00
Not a valid time.
> 1
Start (HH:MM): 10:70
End (HH:MM): 11:00
Not a valid time.
> 1
Start (HH:MM): 11:00
End (HH:MM): 11:00
End must be after start.
> 1
Start (HH:MM): 15:00
End (HH:MM): 14:00
End must be after start.
> 1
Start (HH:MM): noon
End (HH:MM): 13:00
Not a valid time.
> 2
09:00-10:30 overlaps 10:00-11:00
```

Hours must be 0–23 and minutes 0–59. A missing colon is the same "not a valid time" message, not a crash. After those rejections the conflict list is unchanged.

## Bonus

Print free windows as `13:15-14:40 free`. Hours and minutes are two digits. `minutes / 60` and `minutes % 60` convert back.

## Features to use

**Split the clock text, then do arithmetic.** `split(":")` breaks `"14:30"` into the array `["14", "30"]`. Arrays start at 0, so `parts[0]` is the hour text and `parts[1]` is the minute text. Check `parts.length == 2` before you touch `parts[1]`, or a line with no colon crashes.

```java
String[] parts = line.split(":");
int hours = Integer.parseInt(parts[0]);
int minutes = Integer.parseInt(parts[1]);
int sinceMidnight = hours * 60 + minutes;   // 14:30 -> 870
```

`parseInt` throws `NumberFormatException` on `"noon"`. Catch it and print "Not a valid time." Hours must be 0–23. Minutes must be 0–59. Going back to text for the bonus is the reverse: `minutes / 60` is the hour, `minutes % 60` is the minutes left over. `%02d` in `String.format` prints two digits, so 9 becomes `09`.

**`Appointment` is a small class** with two `int` fields, `startMinutes` and `endMinutes`, plus a constructor. Parsing `HH:MM` can be a method on this class, for example `static int toMinutes(String text)`, so `Main` does not do the arithmetic.

**Sort with a comparator.** This line orders the list by start time. `a` and `b` are two appointments. `Integer.compare` returns a negative number when `a` starts first, positive when `b` starts first, and 0 when they start together.

```java
import java.util.ArrayList;

ArrayList<Appointment> appointments = new ArrayList<>();
appointments.sort((a, b) -> Integer.compare(a.startMinutes, b.startMinutes));
```

The `(a, b) -> ...` part is a short function you hand to `sort`. You may copy this line. You have to be able to say what it compares.

**Two loops list each pair once.** The outer loop uses index `i`. The inner loop starts at `j = i + 1`, so you never compare a meeting with itself and you never print the same pair twice.

**One open block after the sort.** If the next meeting starts before the open end, or exactly at the open end, extend the open end to whichever end is later (`Math.max`). If it starts later, the old block is finished and this meeting becomes the open block. Free time is from 08:00 to the first block, between blocks when the gap is longer than 0, and from the last block to 20:00. `Math.max` and `Math.min` also clip a block that sticks out of 08:00–20:00.

## What you learn

Turning `HH:MM` into a number, sorting objects, and the difference between touching and overlapping.

## Submission

Both reports for the four meetings, plus one rejected time. Explain why 11:00 is not a conflict.
