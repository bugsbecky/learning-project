# Getting started

Read this once before task 1. Come back whenever a task uses a word you have not met yet. The tasks do not paste a finished program. They do explain the tools, so you are not guessing what `Scanner` is.

Round 1 assumes you already know variables, `if`, loops, one method of your own, and `System.out.println`. HTML, CSS, and JavaScript basics are enough for the web task. Everything else (reading the keyboard, lists, your own class, files, bash) is taught where it shows up.

## How to work on a task

1. Read **The problem** and **Must** once, all the way through. Do not start coding in the middle of the first bullet.
2. Create the folder and a tiny program that only prints `start`. Compile it and run it. If that does not work, the task is not the problem yet. Fix the setup first.
3. Build **one must-item at a time**. A menu that cannot add anything is a fine first version.
4. Compile and run after every small change. A red error on ten new lines is much harder than a red error on three.
5. When it crashes, read the first line of the message and the line number. Do not delete the file and start over.
6. Run the **self-test** in the task before Sunday. Then explain the program out loud, method by method, with no notes. If you cannot, you are not done, even if the demo looks right.
7. The bonus is optional. Do it only after every must-item works.

You do not have to finish all eight tasks. Each accepted task is cleaned on its own.

## Where the code lives

Keep solutions on your machine, not in git:

```text
cleaning-projects/solutions/01-password/
  Main.java
  PasswordFactory.java
```

`solutions/` is gitignored. One folder per task. Every Java task lists the files you need. One job per file. No `package` line. The file name matches the class name: class `Main` lives in `Main.java`.

## The terminal, in one sitting

Open Terminal. These commands are the same idea on macOS and Linux.

| Command | What it does |
|---------|----------------|
| `pwd` | Prints the folder you are in right now. |
| `ls` | Lists files in that folder. |
| `cd cleaning-projects/solutions` | Moves into a folder. |
| `mkdir 01-password` | Creates a folder. |
| `cd 01-password` | Moves into the new folder. |
| `cd ..` | Moves up one folder. |

Check you are in the right place before compiling. `pwd` should end in the task folder. `ls` should show your `.java` file.

Check Java 21:

```bash
java --version
javac --version
```

Both should say `21`. `java` runs a program. `javac` compiles source code into a `.class` file the runner understands.

## A program you can copy

This is not a task solution. It is the shape every console task starts from.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("start");
    }
}
```

From the folder that contains `Hello.java`:

```bash
javac Hello.java
java Hello
```

`java Hello` has no `.java` and no `.class`. If the terminal says "could not find or load main class", you are probably in the wrong folder, or the class name and the file name differ.

A class marked `public` must be the only public class in that file, and the file name must match it. One public class per file.

## More than one Java file

You have been putting a whole program in one file. These tasks do not work that way. `Main.java` talks to the terminal. The other files do the work. Sunday is a fail if the interesting logic is still all inside `main`, even when the demo looks right.

Here is a complete tiny program that is not a task. Two files, same folder:

```java
// Greeter.java
public class Greeter {
    public String hello(String name) {
        return "Hi " + name;
    }
}
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Greeter greeter = new Greeter();
        System.out.println(greeter.hello("Sam"));
    }
}
```

Stand in that folder (`pwd` should end there) and run:

```bash
javac *.java
java Main
```

`javac *.java` compiles every `.java` file. You get `Greeter.class` and `Main.class`. `java Main` starts the class that contains `main`. It does not take a `.java` suffix, and it is not `java Greeter`.

`Main` can mention `Greeter` with no `import`, because both files sit in the same folder and neither one starts with `package`.

Rules for every Java task:

1. Create the files the task names before you write the clever part. Empty files that compile are a fine first step.
2. Only `Main` has `main`.
3. No `package` line at the top. If you add one, `java Main` stops finding the class.
4. If the compiler says `cannot find symbol` for a class you did write, you compiled only one file. Use `javac *.java`.
5. Keyboard reading stays in `Main`, unless the task says otherwise. Other classes receive values as parameters and return results.

**What a package is, and why you skip it for now.** A line like `package budget;` tells Java "this class lives in a folder named `budget`." You then stand in the parent folder and run `java budget.Main`. That is how big projects avoid name clashes. In this round it only adds a way to break the commands above. Several files in one folder is the skill. Packages can wait.

If `java Main` says it could not find the main class: you are in the wrong folder, the class is not named `Main`, or a `package` line is still there. `pwd` and `ls` before you change any logic.

## Ask Cursor without getting the answer

In Cursor chat, type `/` and pick a command. The files are `cleaning-projects/.cursor/commands/`. Open the `cleaning-projects` folder as the Cursor window so that menu can see them. A command may explain an idea or show an unrelated example. It will not write your task.

| Type this | When |
|-----------|------|
| `/hint` | You are stuck and want one nudge, not the code. |
| `/explain` | A word or idea does not make sense yet. |
| `/files` | You are not sure how to split the work across files. |
| `/run` | `javac` or `java` is the problem, not the idea. |
| `/error` | The terminal printed an error and you want it translated. |
| `/review` | You want feedback on the files you already wrote. |
| `/check` | You want a Sunday rehearsal against the must-list. |

Paste the task name, and paste the error or the file when you have one. "It doesn't work" is a weak `/hint`. "Task 1, length 7 crashes, here is the error" is a good one.

## Terminal I/O in Java

I/O means input and output. In these tasks the terminal is both the keyboard and the screen.

**Output** goes to the screen with `System.out`:

```java
System.out.println("Hello");       // prints text, then a new line
System.out.print("Length: ");      // prints text, stays on the same line
System.out.printf("Total: %.2f%n", 6.2);  // fills in the number, two decimal places
```

`println` is "print line". `printf` is "print formatted". `%.2f` means a decimal number with two digits after the dot. `%n` means a new line. `String.format("%.2f", 6.2)` builds that text without printing it, which is what you want inside a bigger line.

**Input** comes from the keyboard through `System.in`. You do not read `System.in` byte by byte. You wrap it in a `Scanner`:

```java
import java.util.Scanner;

public class Ask {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Your name: ");
        String name = input.nextLine();

        System.out.println("Hi " + name);
    }
}
```

`import` tells Java where `Scanner` lives (`java.util`). Without the import, the compiler says it cannot find the symbol `Scanner`.

`nextLine()` reads everything you type until you press Enter, and it returns a `String`. The Enter itself is not part of the string.

### Read a number without crashing

People type `abc` when you expected `8`. `Integer.parseInt` turns a string into an `int`. If the string is not a whole number, it throws `NumberFormatException`. Catch it and ask again:

```java
int length = -1;
while (length < 8 || length > 32) {
    System.out.print("Length (8-32): ");
    String line = input.nextLine().trim();
    try {
        length = Integer.parseInt(line);
    } catch (NumberFormatException ex) {
        length = -1;
    }
    if (length < 8 || length > 32) {
        System.out.println("That length is not allowed.");
    }
}
```

`trim()` removes spaces at the ends. An empty line becomes `""`, `parseInt` fails, you land in the `catch`, and the loop asks again. That is the "no crash" rule in the tasks.

Decimals work the same way with `Double.parseDouble`. Use a dot, not a comma: `1.5` works, `1,5` does not.

### Why not `nextInt()`

`Scanner` also has `nextInt()` and `nextDouble()`. They look shorter and cause a classic bug. `nextInt()` reads the digits and **leaves the newline sitting in the input**. The next `nextLine()` then returns an empty string, and it looks like the user typed nothing.

For every task in this round, read with `nextLine()` and parse the string yourself. One style, no surprise blank lines.

### Yes / no and menus

Compare strings with `.equals`, not with `==`. `==` on strings asks "are these the same object?", which is not the question you mean.

```java
String answer = input.nextLine().trim().toLowerCase();
if (answer.equals("y")) {
    // yes
} else if (answer.equals("n")) {
    // no
} else {
    System.out.println("Please type y or n.");
}
```

A menu is a loop around that idea. `switch` picks a branch from the text `"1"`, `"2"`, and so on. Unknown input hits `default` and the loop repeats. Quitting sets a boolean to `false` so the loop ends. Do not call `System.exit` for a normal quit. Let `main` finish.

Do not close the `Scanner` that wraps `System.in`. Closing it closes the keyboard for the rest of the process. Create one scanner in `main` and pass it into methods that need it, or keep it as a field. Passing it is easier to explain on Sunday: "this method asks a question, it does not own the keyboard."

## When `javac` complains

The compiler runs before your program. Nothing has executed yet.

| Message | Usually means |
|---------|----------------|
| `cannot find symbol` | Typo in a name, missing import, or you used a variable outside the block where it exists. |
| `';' expected` | A line is missing a semicolon, or a quote was never closed. |
| `class X is public, should be declared in a file named X.java` | File name and public class name differ. |
| `incompatible types` | You put a `String` where an `int` belongs, or the other way around. |

Fix the **first** error. Later errors are often fallout from that one.

## When the program crashes while running

The first line is the type of crash. Below it, `at YourFile.java:27` is your line. Lines mentioning `java.base` are inside Java, not where you start.

| Crash | Usually means |
|-------|----------------|
| `NumberFormatException` | `parseInt` / `parseDouble` got text that is not a number. Catch it. |
| `InputMismatchException` | `nextInt` met a word. Prefer `nextLine` plus parse. |
| `IndexOutOfBoundsException` | A list or string position does not exist. Positions start at 0. |
| `NullPointerException` | You called a method on `null`. Something was never assigned. |
| `ArithmeticException` | Division by zero. |

A crash on bad input fails the task. A printed message and another prompt passes.

## Words that show up in round 1

**Class.** A blueprint: the name of a thing and the data it holds. `Item` might hold a name, a quantity, and a price.

**Object.** One real item built from that blueprint. Two `Item` objects can both be called `Item` and still be different shopping lines.

**Field.** A variable that belongs to the object (`name`, `quantity`).

**Constructor.** The method that runs when you write `new Item(...)`. It fills the fields. It has no return type and the same name as the class.

**Method.** A named block you can call. Parameters are the inputs. `return` is the output. `void` means there is no output.

**`this`.** The object the method is running on. `this.name = name` stores the parameter into the field when both are called `name`.

**`String` and `char`.** A `String` is text: `"abc"`. A `char` is one character: `'a'`. Quotes differ. `text.charAt(0)` is the first character. The first index is 0, not 1.

**`ArrayList`.** A list that grows. `add` appends, `get(i)` reads, `remove(i)` deletes, `size()` is the count. You need `import java.util.ArrayList;`.

**`HashMap`.** A dictionary from a key to a value, for example a name to a balance in cents. `put`, `get`, `containsKey`. Missing keys return `null`, so check before you use the value.

**Exception.** A problem that jumped out of the normal path. `try` / `catch` handles it. Uncaught, it crashes the program.

**Stack trace.** The list of method calls that were active when it crashed. Top is the crash, your file name is where you look.

## Asking an AI, and still learning

Allowed: "Explain what `HashMap` is, with an example that is not my task." "Why does `nextInt` skip my next question?" "What does this compiler error mean?" Paste your error and the few lines around it.

Not enough on Sunday: a file you cannot explain line by line. If you accept generated code, retype the parts you keep and say out loud what each line does before you move on. Two questions in the explain-check will be about lines you wrote. "The AI did that" is not an answer.

When you are stuck for more than about 15 minutes, ask a specific question: what you wanted, what you typed, what the program did, which line you think is involved. "It doesn't work" has nowhere to start.

## Not in this round

No Maven, no Spring, no database, no JUnit, no `package` line. Those are useful later, after several files in one folder feel ordinary. A framework will not get a sink cleaned.
