# Task 4 — Shared expenses

| | |
|---|---|
| Difficulty | Medium |
| Category | Java Core |
| Reward | Sink and toilet |
| Time | about 4–7 hours |

## The problem

Sometimes one person pays for everyone, sometimes for one other person. At the end you need each balance and the transfers that bring every balance to zero. This has to work for three people, not only for a couple split in half.

## Where it lives

```text
cleaning-projects/solutions/04-shared-expenses/
  Main.java       menu and questions. No balance math.
  Expense.java    who paid, amount in cents, participant names
  Ledger.java     people, balances, transfers
```

```bash
javac *.java
java Main
```

Store money as whole cents. `10.50` euros is `1050`. Print euros with two decimals only when you show a number. `0.1 + 0.2` is not `0.3` in a `double`, which is why the running totals are not `double`.

A positive balance means "is owed money." A negative balance means "owes money." The payer's balance goes up by the amount minus their own share. Everyone else in the expense goes down by their share. Leftover cents from integer division (`1000 % 3` is `1`) go to the payer, or the balances will not sum to 0.

## Normal use

```text
1) Add person  2) Add expense  3) Balances  4) Transfers  5) Quit
> 1
Name: Anna
> 1
Name: Ben
> 1
Name: Clara
> 2
Who paid: Anna
Amount in euros: 60
For whom (names separated by commas, or 'all'): all
> 2
Who paid: Ben
Amount in euros: 15
For whom (names separated by commas, or 'all'): Clara
> 3
Anna    +40.00
Ben      -5.00
Clara   -35.00
> 4
Clara pays Anna 35.00 euros
Ben pays Anna 5.00 euros
> 5
```

Another transfer order is fine if every balance would be `0.00` afterward and no cent is invented. On paper first: 60 euros for three people is 20 each, so Anna is `+40`, Ben and Clara are `-20`. Then Ben's 15 euros for Clara only moves Ben to `-5` and Clara to `-35`.

## Edge cases

Nothing is saved when the line is bad. Balances stay as they were.

```text
> 2
Who paid: Dana
Amount in euros: 10
For whom: all
Unknown person: Dana
> 2
Who paid: Anna
Amount in euros: -5
For whom: all
Amount must be greater than 0.
> 2
Who paid: Anna
Amount in euros: 0
For whom: all
Amount must be greater than 0.
> 2
Who paid: Anna
Amount in euros: abc
For whom: all
Amount must be a number.
> 2
Who paid: Anna
Amount in euros: 10
For whom:
Name at least one person, or 'all'.
> 3
Anna    +40.00
Ben      -5.00
Clara   -35.00
```

The balances above are the ones from the normal session. A failed attempt must not change them.

## Bonus

As few transfers as possible. Without the bonus, several small transfers are fine.

## Features to use

**Cents are an `int`.** `10.50` euros is `1050` cents. `Math.round` returns the nearest whole number, which you then store as an `int`.

```java
double euros = Double.parseDouble(line);
int cents = (int) Math.round(euros * 100);
```

Integer division drops the fraction: `1000 / 3` is `333`, and `1000 % 3` is the leftover `1`. `%` is the remainder. Give those leftover cents to the payer. Printing uses `String.format("%.2f", cents / 100.0)` so `4000` cents shows as `40.00`. Dividing by `100.0` (with the decimal) makes the result a decimal. Dividing by `100` would stay an integer and drop the cents.

**`HashMap` is a dictionary.** The key is the name. The value is the balance in cents.

```java
import java.util.HashMap;

HashMap<String, Integer> balance = new HashMap<>();
balance.put("Anna", 0);
int anna = balance.get("Anna");       // 0
balance.put("Anna", anna + 1500);     // now +1500 cents
boolean known = balance.containsKey("Dana");  // false until you put Dana
```

`get` on a missing name returns `null`. You cannot add a number to `null`. Call `put(name, 0)` when the person is added, and check `containsKey` before you trust a name typed at the prompt.

`balance.keySet()` is every name, if you need to print them all.

**An expense is an object, same idea as `Item` in task 2.** Fields for who paid, the cents, and the names. `List<String>` or an `ArrayList<String>` holds the participant names. `split(",")` breaks `"Clara"` or `"Anna, Ben"` into pieces. `trim()` removes the spaces around each name.

**Transfers.** Find the person with the largest positive balance and the person with the largest negative one. The amount to move is the smaller of the two absolute values (`Math.abs`). Add it to the negative balance and subtract it from the positive one. Repeat until every value is 0. `Math.max` and `Math.min` pick the larger or smaller of two ints.

## What you learn

A map from name to balance, cents instead of `double`, and a loop that settles the debts one transfer at a time.

## Submission

The Anna/Ben/Clara session. Explain where the leftover cent goes.
