# Task 2 — Shopping list

| | |
|---|---|
| Difficulty | Easy |
| Category | Java Core |
| Reward | Sink |
| Time | about 2–5 hours |

## The problem

Before the store, you want the lines and the total. Each line is a name, a quantity, and a price. Those three values belong on one object, not in three separate lists.

## Where it lives

```text
cleaning-projects/solutions/02-shopping-list/
  Main.java            menu and Scanner
  Item.java            one line: name, quantity, unit price, line total
  ShoppingList.java    the ArrayList: add, remove, table, total
```

No `package` line.

```bash
javac *.java
java Main
```

`Main` does not keep the list. It asks questions and calls `ShoppingList`.

## Normal use

The menu stays up until you choose quit. Prices on screen always have two decimal places.

```text
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 1
Name: Milk
Quantity: 2
Price: 1.5
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 1
Name: Bread
Quantity: 1
Price: 3.2
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 2
1  Milk   2  1.50  3.00
2  Bread  1  3.20  3.20
Total: 6.20
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 3
Position: 1
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 2
1  Bread  1  3.20  3.20
Total: 3.20
1) Add  2) Show  3) Remove  4) Total  5) Quit
> 5
```

Position `1` on screen is index `0` in the list. Column spacing may differ. The numbers may not.

## Edge cases

A bad line is refused. Nothing is stored, and nothing already stored is deleted.

```text
> 1
Name:
Quantity: 1
Price: 1
Name cannot be empty.
> 1
Name: Eggs
Quantity: 0
Price: 2
Quantity must be at least 1.
> 1
Name: Eggs
Quantity: -3
Price: 2
Quantity must be at least 1.
> 1
Name: Eggs
Quantity: two
Price: 2
Quantity must be a whole number.
> 1
Name: Eggs
Quantity: 1
Price: -1
Price cannot be negative.
> 3
Position: 9
No item at that position.
> 2
1  Bread  1  3.20  3.20
Total: 3.20
```

Show on an empty list prints a total of `0.00` and no crash. Quit is option 5, not closing the terminal window.

## Bonus

Ask for a weekly budget once at startup. On show, if the total is over it, print a warning. If not, print how much is left.

## Features to use

**A class is the blueprint for one shopping line.** Fields hold the data. The constructor runs when you write `new Item(...)`. `this.name` means the field, when the parameter is also called `name`.

```java
public class Item {
    String name;
    int quantity;
    double unitPrice;

    public Item(String name, int quantity, double unitPrice) {
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public double lineTotal() {
        return quantity * unitPrice;
    }
}
```

`new Item("Milk", 2, 1.5)` builds one object. Two items are two objects. Deleting one does not scramble the other.

**`ArrayList` is the list that grows and shrinks.** It lives in `ShoppingList`, not in `Main`.

```java
import java.util.ArrayList;

ArrayList<Item> items = new ArrayList<>();
items.add(new Item("Milk", 2, 1.5));
Item first = items.get(0);     // index 0 is the first item
items.remove(0);                // later items shift left
int count = items.size();
```

The `<Item>` part means "a list of `Item`, not a list of anything." The screen shows positions starting at 1. The list starts at 0, so position 1 is `get(0)` and `remove(position - 1)`.

**A menu is a loop plus `switch`.** `switch` picks a branch from the text `"1"`, `"2"`, and so on. Unknown input hits `default`.

```java
String choice = input.nextLine().trim();
switch (choice) {
    case "1" -> { /* add */ }
    case "5" -> running = false;
    default -> System.out.println("Unknown choice.");
}
```

**Turn text into a number, and don't crash.** `nextLine()` reads the whole line. `Integer.parseInt` and `Double.parseDouble` turn that text into a number. Bad text throws `NumberFormatException`. Catch it and print your message.

```java
try {
    quantity = Integer.parseInt(line);
} catch (NumberFormatException ex) {
    System.out.println("Quantity must be a whole number.");
}
```

Do not use `nextInt()` or `nextDouble()`. They leave the Enter key sitting in the input, and the next question looks skipped.

**Two decimal places are a print format, not a type.** `String.format("%.2f", 6.2)` produces `"6.20"`. `%.2f` means a decimal with two digits after the dot. Sum the numbers first, then format once when you print.

## What you learn

Your own class, a list of those objects, and a menu that stays up until quit.

## Submission

The milk/bread session above, then one empty name. Explain why position 1 is `get(0)`.
