# Task 1 — Password generator

| | |
|---|---|
| Difficulty | Easy |
| Category | Java Core |
| Reward | Sink |
| Time | about 1–3 hours |

## The problem

`sweetheart123` is not a password you want to leave anywhere. A password manager asks how long the password should be, which character kinds to include, and then prints one mixed password.

## Where it lives

```text
cleaning-projects/solutions/01-password/
  Main.java              asks the questions and prints
  PasswordFactory.java   builds and mixes the password
```

No `package` line. From that folder:

```bash
javac *.java
java Main
```

`Main` owns the keyboard. `PasswordFactory` takes the length and the three answers and returns a `String`. It does not use `Scanner`.

## Normal use

You type the length, then `y` or `n` three times. Lowercase is always included.

```text
Length (8-32): 8
Uppercase (y/n): y
Digits (y/n): y
Special characters (y/n): n
aK3mP9qL
```

The password line is random, so yours will differ. It must still be exactly 8 characters, contain at least one uppercase letter, one digit, and one lowercase letter, and contain no special character. The kinds must be mixed: `ABCabc12` is not done.

Run it again with the same answers. The second password must not reliably match the first.

## Edge cases

Bad input prints a message and asks that question again. The program does not crash and does not print a password yet.

```text
Length (8-32): 7
Length must be from 8 to 32.
Length (8-32): abc
Length must be from 8 to 32.
Length (8-32):
Length must be from 8 to 32.
Length (8-32): 100
Length must be from 8 to 32.
Length (8-32): 8
Uppercase (y/n): yes
Please type y or n.
Uppercase (y/n): y
Digits (y/n): n
Special characters (y/n): n
```

The password that follows is 8 letters, lowercase only. No digit, no uppercase, no special. The letters themselves will differ every run.

Also rejected, same way: length `0`, length `-4`, a blank yes/no line.

## Bonus

After the password, print `weak`, `medium`, or `strong`.

- weak: shorter than 12, or fewer than three kinds (lowercase counts)
- medium: at least 12 characters and at least three kinds
- strong: at least 16 characters and all four kinds

Length 8 with uppercase and digits is `weak`. Length 16 with all three answers `y` is `strong`.

## Features to use

**`Random` picks a number, not a character.** Create one `Random` and keep reusing it. A new `Random` on every call is unnecessary.

```java
import java.util.Random;

Random random = new Random();
int index = random.nextInt(26);   // 0, 1, 2, ... or 25. Never 26.
```

`nextInt(n)` means "an int from 0 up to, but not including, n." That matches string indexes, which also start at 0. If the pool has 26 letters, `nextInt(26)` is a legal index. `nextInt(0)` crashes, so do not call it on an empty pool.

**`char` is one character. `String` is many.** Different quotes.

```java
char letter = 'a';
String lowers = "abcdefghijklmnopqrstuvwxyz";
char picked = lowers.charAt(index);   // the character at that index
```

`"a"` is a `String`. `'a'` is a `char`. `charAt` only works on a `String`.

**`StringBuilder` builds the password one character at a time.** A `String` cannot be changed in the middle. A builder can.

```java
StringBuilder password = new StringBuilder();
password.append(picked);          // add at the end
password.setCharAt(0, 'Z');       // replace the character at index 0
int length = password.length();
String text = password.toString(); // the normal String you print
```

**A method in the other file returns the password.** `Main` does not contain `Random`. It calls something like `factory.build(length, uppercase, digits, specials)` and prints the `String` that comes back. Parameters are the inputs. `return` is the output. `boolean` is the type for a yes/no answer (`true` or `false`).

**Approach, not the finished method.** Pools you can copy: lowercase `"abcdefghijklmnopqrstuvwxyz"`, uppercase `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"`, digits `"0123456789"`, specials a short string you choose such as `"!@#$%&*?"`. Put one character from each chosen pool in first, fill the rest from the combined pool, then swap so the kinds are not grouped. From the last index down to 1, pick `j` with `nextInt(i + 1)` and swap the characters at `i` and `j` using `charAt` and `setCharAt`.

## What you learn

Reading a line in the terminal, rejecting it before you use it, and calling a second class that returns the password.

## Submission

Live in the terminal: the normal session and one bad length. Explain the shuffle.
