# Task 3 — Cleaning schedule

| | |
|---|---|
| Difficulty | Easy |
| Category | Web snack |
| Reward | Sink |
| Time | about 2–4 hours |

## The problem

The deal needs a page you can open on a phone: seven days, and which bathroom surface is on each day. Today is highlighted by JavaScript, not typed into the HTML by hand.

## Where it lives

```text
cleaning-projects/solutions/03-cleaning-schedule/
  index.html     the seven days and the jobs. No <style> and no <script> block.
  styles.css     layout and the .today look
  app.js         finds today and sets the class
```

Nothing to compile. In `index.html`:

```html
<link rel="stylesheet" href="styles.css">
```

in `head`, and

```html
<script src="app.js"></script>
```

at the end of `body`. Also in `head`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Open `index.html` in the browser. After each save, reload.

## Normal use

1. You see all seven weekdays. Each day shows at least one of: sink, toilet, shower, floor, mirror.
2. The days are cards in a row (flex or grid), not a plain bullet list.
3. Today has a highlight that comes from `app.js` adding a class. The HTML you wrote does not contain `class="today"`.
4. You can say which number `new Date().getDay()` is today (Sunday is 0, Monday is 1, …, Saturday is 6) and which card receives it.

`getDay()` returns 0–6 in that Sunday-first order. If your HTML starts on Monday, Sunday is not the first card. Write that mapping down before you code it.

## Edge cases

- Drag the window to about 390px wide, or use the browser device toolbar. All seven days stay readable. Nothing scrolls sideways. Cards may stack.
- Reload the page. Today is still the highlighted day. A highlight you only painted in HTML would be the same card every day; yours has to follow `getDay()`.
- If the script is in `head` without `defer`, it runs before the days exist and nothing lights up. The script tag stays at the end of `body`, or it uses `defer`.
- A wrong `href` means no layout. The CSS file sits next to the HTML file.
- Do not put the behavior in `onclick` or `style` attributes. Clicks, if you add the bonus, are in `app.js`. Colors are in `styles.css`.

## Bonus

A control labeled "this week done." First click marks the week done. Second click clears it. Reloading may clear it. No `localStorage`.

## Features to use

**The HTML file only describes the page.** A day card is an element with a class you can find later. Do not put `class="today"` in the file. Do not put a `<style>` or `<script>` block in it.

```html
<section class="week">
  <article class="day">
    <h2>Monday</h2>
    <p>Sink</p>
  </article>
</section>
```

**Flexbox lays the cards out.** `display: flex` puts children in a row. `flex-wrap: wrap` lets them drop to the next line when the window is narrow. `gap` is the space between cards. `flex: 1 1 140px` means each card tries to be about 140px wide and may grow or shrink.

```css
.week {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.day {
  flex: 1 1 140px;
}
.today {
  outline: 3px solid #0b6;
  font-weight: 700;
}
```

Grid is the other allowed choice: `display: grid` and `grid-template-columns`. One of the two is enough. The highlight color lives in `.today` in this file, not in JavaScript.

**`getDay()` is today's number.** `new Date()` is "right now." `getDay()` returns 0 for Sunday through 6 for Saturday.

```javascript
const today = new Date().getDay();
```

**`querySelectorAll` finds every card.** The string `".day"` means "elements with class `day`." You get them in the order they appear in the HTML. Index 0 is the first one.

```javascript
const days = document.querySelectorAll(".day");
days.forEach((day) => day.classList.remove("today"));
days[index].classList.add("today");
```

`classList.add` turns a CSS class on. `classList.remove` turns it off. Clear every card first, or yesterday stays highlighted too. If your HTML starts on Monday, Sunday is not index 0. Map the number before you use it as an index.

**The bonus click is also in `app.js`.** `document.querySelector("#done")` finds one button by its id. `addEventListener("click", ...)` runs a function when it is clicked. `classList.toggle("done")` adds the class if it is missing and removes it if it is there.

## What you learn

Three files that the browser loads together, a layout that wraps, and "today" coming from the clock instead of from a hardcoded class.

## Submission

The page in the browser, the window dragged narrow, and you pointing at the line that picks the weekday.
