# Task 7 — Household budget

| | |
|---|---|
| Difficulty | Hard |
| Category | Real-world tools |
| Reward | Whole bathroom |
| Time | about 6–12 hours |

## The problem

A list in memory dies when the program exits. This one writes a file on quit and reads it back on the next start, then answers "what did food cost in October?"

## Where it lives

```text
cleaning-projects/solutions/07-budget/
  Main.java          menu and questions. It does not split CSV.
  Booking.java       one booking, toCsvLine(), parse one line
  BudgetBook.java    the list, load, save, reports. Only this class knows the path.
  household.csv      created when you quit. Not a Java file.
```

```bash
javac *.java
java Main
```

Run `java Main` from this folder. The CSV is created here, because Java uses the folder you were in, not the folder the `.java` file sits in.

Money is cents. The file is semicolon-separated, one booking per line:

```text
date;kind;category;description;cents
2026-10-03;expense;food;pizza;1850
2026-10-04;income;salary;october;250000
```

A semicolon, not a comma, so a description may contain a comma. The header is written on save and skipped on load. Open the file with try-with-resources. A missing file on the first start is an empty book, not a crash.

## Normal use

```text
1) Add  2) List  3) By category  4) Top 3  5) Balance  6) Month  7) Quit
> 1
Date (YYYY-MM-DD): 2026-09-02
Kind (income/expense): expense
Category: food
Description: groceries
Amount in euros: 12.50
> 1
Date (YYYY-MM-DD): 2026-10-03
Kind (income/expense): expense
Category: food
Description: pizza
Amount in euros: 18.50
> 1
Date (YYYY-MM-DD): 2026-10-04
Kind (income/expense): income
Category: salary
Description: october
Amount in euros: 2500
> 5
Balance: 2469.00
> 6
Month (YYYY-MM): 2026-10
2026-10-03  expense  food     pizza    18.50
2026-10-04  income   salary   october  2500.00
Balance: 2481.50
> 3
food  31.00
> 4
1  pizza      18.50
2  groceries  12.50
> 7
```

Quit writes `household.csv`. Start the program again. List shows the same three bookings.

Category totals count expenses only, so salary does not shrink the food number. The month view's balance is October only, not the whole book. Top 3 lists the most expensive expenses. With two expenses, print those two. Sorting for top 3 uses a copy of the list, so "list all" stays in the order you entered.

Balance is income minus expenses. September food is `12.50`, October food is `18.50`, together `31.00`. October balance is `2500 - 18.50 = 2481.50`. Overall balance is `2500 - 12.50 - 18.50 = 2469.00`.

## Edge cases

A bad booking is not added. The menu comes back.

```text
> 1
Date (YYYY-MM-DD): 03-10-2026
Kind (income/expense): expense
Category: food
Description: bread
Amount in euros: 2
Date must be YYYY-MM-DD.
> 1
Date (YYYY-MM-DD): 2026-10-05
Kind (income/expense): gift
Category: fun
Description: flowers
Amount in euros: 8
Kind must be income or expense.
> 1
Date (YYYY-MM-DD): 2026-10-05
Kind (income/expense): expense
Category: fun
Description: flowers
Amount in euros: -8
Amount must be greater than 0.
> 1
Date (YYYY-MM-DD): 2026-10-05
Kind (income/expense): expense
Category:
Description: flowers
Amount in euros: 8
Category cannot be empty.
```

Then stop the program and edit `household.csv` by hand. Change one data line to `this;is;broken` and leave a valid line under it. Start again:

```text
Skipping line 3: this;is;broken
```

The valid bookings are still there. A stack trace is not the only output. The line number in the message matches the broken line.

## Bonus

Write `report-2026-10.txt` for a month you choose: balance, total per category, the three most expensive expenses, in sentences a person can read. Same try-with-resources pattern. Cents are shown as euros.

## Features to use

**`Path` and try-with-resources are how you open a file.** `Path.of("household.csv")` is the file in the folder where you ran `java Main`. `Files.exists` is false on the first run. That is not an error.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

Path path = Path.of("household.csv");
if (Files.exists(path)) {
    try (BufferedReader reader = Files.newBufferedReader(path)) {
        String line;
        int lineNumber = 0;
        while ((line = reader.readLine()) != null) {
            lineNumber++;
            // skip the header, or parse the line
        }
    } catch (IOException ex) {
        System.out.println("Could not read the file: " + ex.getMessage());
    }
}
```

`readLine()` returns the next line, or `null` when the file is finished. The `try (` ... `)` header closes `reader` when the block ends, including when something throws. You do not write a separate close. Writing uses `BufferedWriter writer = Files.newBufferedWriter(path)` in the same shape. Write the header, then one line per booking, every time you quit. Do not try to edit a single line in the middle of the file.

**`split` turns one CSV line into fields.**

```java
String[] fields = line.split(";");
String dateText = fields[0];
String kind = fields[1];
```

Check `fields.length` before you use `fields[4]`. Too few fields means a broken line: print the line number and `continue` the loop. Do not let that exception escape `load`, or the good lines above it are lost.

**`LocalDate` checks the date for you.**

```java
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

try {
    LocalDate date = LocalDate.parse("2026-10-03");
    int year = date.getYear();
    int month = date.getMonthValue();
} catch (DateTimeParseException ex) {
    // not YYYY-MM-DD
}
```

`LocalDate.parse` accepts `2026-10-03` and throws on `03-10-2026`. Catch that per line. `getYear()` and `getMonthValue()` answer the month filter.

**Two methods own the format.** `toCsvLine()` on a `Booking` returns one semicolon line. A `parse` method turns one line into a `Booking` or signals that the line is junk. `Main` never calls `split`. `BudgetBook` is the only class that mentions `household.csv`.

**Top 3 uses a copy.** `new ArrayList<>(expenses)` copies the list. Sort the copy by cents, high to low, and print at most three. Sorting the original list changes the order of "list all."

```java
copy.sort((a, b) -> Integer.compare(b.cents(), a.cents()));
```

`b` then `a` is descending. `a` then `b` would be ascending.

## What you learn

The terminal menu you already know, plus a file that survives quit, and three classes with one job each.

## Submission

Add three bookings, quit, start, list them. Then the broken CSV line. Explain which class knows the file path, and what try-with-resources closes when something fails.
