# Weather Dashboard — Beginner Code Review

Review of the `src/` implementation in [01-weather-dashboard](https://github.com/bugsbecky/training-projects/tree/main/01-weather-dashboard).

**Short verdict:** The hard part works — city → coordinates → weather. That is a big win. Next, fix a few bugs, add errors/loading, and polish the UI so the app feels finished.

---

## What is really good

### 1. Two-step API flow (the main goal)

You did the core idea correctly:

1. Ask “Where is this city?” (geocoding)
2. Ask “What is the weather there?” (forecast)

**Real world:** Like asking a friend for an address, then using that address to look up the weather for that house — not guessing by city name alone.

```js
// You already do this idea:
getWeatherInformation(city)  // → gets latitude/longitude
  → getWeatherData(geoData)  // → gets weather for those coords
```

### 2. Safe city name in the URL

```js
encodeURIComponent(city)
```

**Why good:** Spaces and special letters (e.g. `São Paulo`) become safe for a URL.  
**Real world:** Like writing an address carefully so the post office does not get confused.

### 3. `URLSearchParams` for the weather request

```js
const geoParams = new URLSearchParams({
  latitude: ...,
  longitude: ...,
  forecast_days: '5',
  // ...
});
```

**Why good:** Cleaner and less error-prone than building a long string by hand.

### 4. Form + `preventDefault`

```js
cityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // ...
});
```

**Why good:** Without this, the page reloads and your result disappears.  
**Real world:** Like stopping the browser from “refreshing the whole shop” when you only want to ask one question.

### 5. Building the page with `createElement`

You create `<p>` elements and set `textContent`. That is safer than dumping raw HTML strings into the page.

### 6. Small but solid HTML basics

- `lang="en"`, charset, viewport
- `defer` on the script (waits until HTML is ready)
- A real `<form>` (Enter can submit)

---

## What needs work (and how to fix it)

### 1. Bug: only the min temperature shows

**Bad (current):**

```js
temperatureOutput.textContent = maxTemp+unit, minTemp+unit;
```

The comma `,` means JavaScript keeps only the **last** value. So max is thrown away.

**Good:**

```js
temperatureOutput.textContent = `Max: ${maxTemp}${unit} · Min: ${minTemp}${unit}`;
// Example on screen: Max: 22°C · Min: 14°C
```

**Real world:** Like saying “tall, short” and only writing down “short”.

---

### 2. Crash risk: city not found

**Bad (current):**

```js
latitude: URL.results[0].latitude
```

If the city does not exist, `results` is missing → the app breaks.

**Good:**

```js
async function getWeatherInformation(city) {
  const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const geoResponse = await fetch(geoURL);
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    showError("City not found. Try another spelling.");
    return;
  }

  await getWeatherData(geoData);
}
```

**Real world:** Before ringing doorbell #0, check that the street has houses.

---

### 3. No error handling / no loading

Right now: empty input, bad network, or API problems → silence or a crash. Users need a message and a “please wait” state.

**Good pattern:**

```js
async function onSearch(city) {
  if (!city.trim()) {
    showError("Please type a city name.");
    return;
  }

  showLoading(true);
  hideError();

  try {
    await getWeatherInformation(city);
  } catch (error) {
    showError("Could not load weather. Check your connection and try again.");
  } finally {
    showLoading(false);
  }
}
```

**Real world:**

- Loading = “I’m on the phone asking for the weather…”
- Error = “Sorry, the line was busy / I didn’t hear the city.”

---

### 4. Confusing parameter name: `URL`

**Bad:**

```js
async function getWeatherData(URL) {
  latitude: URL.results[0].latitude
}
```

`URL` sounds like a string link. Here it is an **object** with results.

**Good:**

```js
async function getWeatherData(geoData) {
  const place = geoData.results[0];
  // use place.latitude, place.longitude
}
```

**Real world:** Don’t call a phone book a “phone number”. Names should match what the thing is.

---

### 5. Missing `await`

**Bad:**

```js
getWeatherData(geoData); // starts, but you don’t wait for it
```

**Good:**

```js
await getWeatherData(geoData);
```

**Why:** So errors from the weather call can be caught in one place, and you know when loading is finished.

---

### 6. Label points to the wrong thing

**Bad:**

```html
<label for="city-form">City</label>
<input id="city-input" ... />
```

`for` must match the **input’s** `id`.

**Good:**

```html
<label for="city-input">City</label>
<input id="city-input" name="city" type="text" placeholder="e.g. London" />
<button type="submit">Search</button>
```

**Real world:** The name tag should stick to the person, not to the whole room.

Also add a **Search** button — beginners often miss that Enter works, but a button makes the app obvious.

---

### 7. Project goals still missing

Compared to the project README, these are not there yet:

| Goal | Status | Simple next step |
|------|--------|------------------|
| Current weather | Missing | Show `current.temperature_2m` above the 5-day list |
| Loading spinner | Missing | Toggle a “Loading…” text or CSS spinner |
| Friendly errors | Missing | One `#error` div + `textContent` |
| Recent searches | Missing | `localStorage` with a small city list |
| Responsive layout | Weak | Center content, stack cards on small screens |
| Split files (`api.js` / `ui.js` / `app.js`) | Optional but helpful | Keep fetch in `api.js`, DOM in `ui.js` |

**Tiny localStorage example:**

```js
function saveRecent(city) {
  const key = "recentCities";
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  const next = [city, ...list.filter((c) => c !== city)].slice(0, 5);
  localStorage.setItem(key, JSON.stringify(next));
}
```

**Real world:** Like the shop remembering your last 5 orders so you can tap them again.

---

### 8. Clean up debug `console.log`

Fine while learning. Before you call it “done”, remove or comment them out so the Console stays clean.

---

### 9. CSS is almost empty

You have a grid class, but almost no layout/style. Minimum polish:

```css
body {
  font-family: system-ui, sans-serif;
  max-width: 40rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

#city-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.weather-div {
  display: grid;
  gap: 0.75rem;
}

.day-card {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

**Tip:** Wrap each day (date + temps) in **one** card `div`, not two loose `<p>` tags. Easier to style.

```js
const card = document.createElement("div");
card.className = "day-card";
card.append(dateOutput, temperatureOutput);
weatherDiv.appendChild(card);
```

---

## Suggested “next 1 hour” checklist

1. Fix the max/min temperature comma bug  
2. Fix the label `for="city-input"` + add Search button  
3. Guard empty input and missing `results`  
4. Add `try/catch` + loading text + error message  
5. Show **current** temperature as well as the 5-day list  
6. Give the page simple spacing and day cards  

---

## Encouragement

You already built a real internet-talking app: form → `fetch` → JSON → screen. That is the skill this project is for. The rest is making it **safe**, **clear**, and **nice to use** — same as turning a working kitchen recipe into a clean restaurant plate.
