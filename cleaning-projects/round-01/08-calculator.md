# Task 8 — Calculator

| | |
|---|---|
| Difficulty | Hard |
| Category | Puzzle |
| Reward | Whole bathroom |
| Time | about 8–15 hours |

## The problem

A spreadsheet has to read `12 + 3 * (4 - 2)` as 18, not as 30. Multiplication before addition, brackets first, spaces ignored. You walk the text and compute it. No `eval`, no parser library.

Build it in layers. An afternoon that only does `2 + 3` is the right first version. Do not start with brackets.

## Where it lives

```text
cleaning-projects/solutions/08-calculator/
  Main.java     prompt loop, exit, print the result or a readable error
  Parser.java   the index into the text, expression, term, factor. No Scanner.
```

```bash
javac *.java
java Main
```

`Main` passes the whole line in. `Parser` returns a number or signals a bad expression. `Main` catches that and shows the prompt again.

## Normal use

```text
> 12 + 3 * (4 - 2)
18
> (1 + 2) * 3
9
> 20 - 4 - 1
15
> 8 / 2 / 2
2
> -3 + 5
2
> ((2 + 3) * (4 - 1))
15
> 7 / 2
3
> 4 * -2
-8
> exit
```

`*` and `/` bind tighter than `+` and `-`. The same strength runs left to right, so `20 - 4 - 1` is 15, not 17, and `8 / 2 / 2` is 2. Division of whole numbers drops the fraction: `7 / 2` is 3. A minus in front of a number or a bracket is "negative," not "subtract from nothing."

Spaces do not matter: `  (1+2) * 3 ` is still 9.

## Edge cases

Each of these prints a short message and returns to the prompt. The program does not end.

```text
> 3 + + 4
I don't understand this expression.
> (3 + 4
Missing ')'.
> 3..2
I don't understand this expression.
>
Empty expression.
> 4 / (2 - 2)
Division by zero.
> 3 4
I don't understand this expression.
> exit
```

Your sentences can differ. The meaning cannot: two operators in a row, an unclosed bracket, a double dot, an empty line, division by zero, and leftover junk after a valid number are all errors. `4 / (2 - 2)` is division by zero even though you never typed `0`.

## Bonus

Decimals with a dot: `3.5 * 2` is `7`. Division is no longer integer division. Without the bonus, a dot is an error and you stay on `int`.

## Features to use

**The prompt loop is `Scanner` in `Main` only.**

```java
Scanner input = new Scanner(System.in);
while (true) {
    System.out.print("> ");
    String line = input.nextLine();
    if (line.trim().equals("exit")) {
        break;
    }
    // hand line to Parser, print the number, or print the error
}
```

`trim()` removes spaces at the ends. `equals` compares text. Do not use `==` for strings. `break` leaves the loop. A bad expression must not `break`.

**A `String` is a row of characters, and an index says where you are.** Indexes start at 0. `length()` is how many characters. `charAt(pos)` is the character at that position.

```java
String text = "12 + 3";
int pos = 0;
char current = text.charAt(pos);   // '1'
```

Keep `pos` as a field on `Parser`. Set it back to 0 at the start of every line. Methods move it forward. Do not cut the string into smaller leftovers. That is how characters get lost.

Skipping spaces is its own method: while `pos < text.length()` and `text.charAt(pos)` is a space, `pos++`. A space character is `' '`.

**Reading a whole number is a loop over digits.** `Character.isDigit(ch)` is true for `'0'` through `'9'`. One digit's value is `ch - '0'`, so `'3'` becomes `3`. `"12"` is one number, not the characters `'1'` and `'2'` used as separate math:

```java
int value = 0;
while (pos < text.length() && Character.isDigit(text.charAt(pos))) {
    value = value * 10 + (text.charAt(pos) - '0');
    pos++;
}
```

`'1'` then `'2'` becomes `(0 * 10 + 1)` then `(1 * 10 + 2)`, which is 12.

**Three methods, one level each.** This is the structure. The bodies are yours.

| Method | Understands | Calls |
|--------|-------------|--------|
| `expression` | `+` and `-`, left to right, in a loop | `term` |
| `term` | `*` and `/`, left to right, in a loop | `factor` |
| `factor` | a number, a leading `-`, or `( expression )` | `expression` when it sees `(` |

`12 + 3 * 4` is 24 because `expression` asks `term` for the right-hand side, and only `term` handles `*`. If `expression` multiplied, the result would be 60. The same-strength loop is why `20 - 4 - 1` is `(20 - 4) - 1`. Do not recurse on the right for `+` or `-`, or you get 17.

When `factor` sees `(`, it moves past that character, calls `expression`, then expects `)`. That call back is why brackets can contain `+` and further brackets. If the string ends before the `)`, that is "Missing ')'", not a zero.

After a successful parse, `pos` must be at `text.length()`. Characters left over (`3 4`, `3..2`) are an error. Division uses `/`. Before you divide, check the right-hand value is not 0.

A useful private method throws when the line is bad, and `Main` catches it:

```java
// inside Parser
private void fail(String message) {
    throw new IllegalArgumentException(message);
}
```

```java
// inside Main
try {
    System.out.println(parser.evaluate(line));
} catch (IllegalArgumentException ex) {
    System.out.println(ex.getMessage());
}
```

`throw` jumps out of the parser. `catch` in `Main` prints the message and the loop continues. `getMessage()` is the sentence you passed to `fail`.

## What you learn

A line from the terminal turned into a value, with operator order expressed as which method calls which.

## Submission

Every line in the normal session, then `3 + + 4` still showing a prompt. Explain why `12 + 3 * 4` is not added left to right inside `expression`.
