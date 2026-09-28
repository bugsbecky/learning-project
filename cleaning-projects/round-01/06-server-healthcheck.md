# Task 6 — Server healthcheck

| | |
|---|---|
| Difficulty | Medium |
| Category | Linux |
| Reward | Sink and toilet |
| Time | about 3–5 hours |

## The problem

You want a morning answer for a list of machines: which ones answer a ping, and an exit code another program could notice. This task is Bash, not Java. The host names live in a file. The script does the work.

## Where it lives

```text
cleaning-projects/solutions/06-healthcheck/
  healthcheck.sh    shebang, loop, ping, summary, exit code
  hosts.txt         one hostname or IP per line. No shell commands.
```

Line 1 of the script is `#!/bin/bash`. Then, from that folder:

```bash
chmod +x healthcheck.sh
./healthcheck.sh
echo $?
```

`echo $?` prints the script's exit code. It must be the next command, because `$?` changes as soon as something else runs.

The script finds `hosts.txt` next to itself, not next to wherever you happen to be. Starting it as `bash /full/path/to/healthcheck.sh` from `/` still reads that file. `pwd` is your folder. The script's folder comes from `$0`.

## Normal use

`hosts.txt`:

```text
127.0.0.1
```

```text
$ ./healthcheck.sh
127.0.0.1 reachable
1 of 1 reachable
$ echo $?
0
```

A second file:

```text
# local
127.0.0.1
host-that-does-not-exist.example
```

Blank lines and lines that start with `#` are skipped. They do not count.

```text
$ ./healthcheck.sh
127.0.0.1 reachable
host-that-does-not-exist.example down
1 of 2 reachable
$ echo $?
1
```

Ping once, with a timeout, so a dead host does not sit there for a minute. On Linux, `ping -c 1 -W 2 host`. On macOS, `-W` is milliseconds, so `-W 2000`. Check `man ping` on the machine you will demo, and say which flag you used.

## Edge cases

```text
$ ./healthcheck.sh
0 of 0 reachable
$ echo $?
1
```

That is an empty `hosts.txt`, or a file that is only comments and blank lines. Exit code 1. No crash, no infinite wait.

A host that does not resolve is `down`, not a script abort. Ping's own error text must not land in the middle of your summary. Send it away with `>/dev/null 2>&1`, and save `$?` into a variable on the next line.

Run from another directory:

```bash
cd /
bash /full/path/to/healthcheck.sh
```

The same `hosts.txt` is read. If you suddenly see `0 of 0`, the script is opening `hosts.txt` from `pwd` instead of from its own folder.

## Bonus

If the filesystem `/` is more than 80% full, print a warning line. The exit code does not change: all hosts up is still 0, plus the warning. `df -P /` prints one stable line. In the explain-check, point at the column you compared.

## Features to use

**The shebang is line 1, and `chmod` makes the file runnable.**

```bash
#!/bin/bash
echo "hello"
```

```bash
chmod +x healthcheck.sh
./healthcheck.sh
```

`./` means "in this folder." `bash /full/path/to/healthcheck.sh` also works and does not need `chmod`.

**Variables have no spaces around `=`.** The quotes are part of using the value, not part of setting it.

```bash
name="localhost"
echo "$name"
```

Always write `"$name"`. Without the quotes, a value with a space splits into two words and breaks the next command.

**`$?` is the exit code of the command that just finished.** `0` means success. Anything else means failure. It changes as soon as another command runs, so copy it immediately.

```bash
ping -c 1 -W 2 "$host" >/dev/null 2>&1
status=$?
if [ "$status" -eq 0 ]; then
  echo "$host reachable"
else
  echo "$host down"
fi
```

The spaces inside `[` and `]` are required. `-eq` means "equal as a number." `>/dev/null` hides normal output. `2>&1` hides error output too, so a dead host does not dump ping's complaint into your summary. You still have `status`.

`-c 1` sends one ping. On Linux, `-W 2` waits about 2 seconds. On macOS, `-W` is milliseconds, so use `-W 2000`. `man ping` shows which one your machine uses.

**A loop reads the file one line at a time.**

```bash
while read -r host; do
  if [ -z "$host" ]; then
    continue
  fi
  echo "got: $host"
done < "$hosts_file"
```

`read -r` stores the line in `host`. `< "$hosts_file"` attaches the file to the loop. `-z` means "empty." `continue` skips the rest of this lap and starts the next line. A comment test can be `${host#\#}`: if removing a leading `#` changes the text, the line was a comment.

**The script's folder is not `pwd`.** `$0` is the path you used to start the script. `dirname` strips the file name and leaves the folder.

```bash
script_dir=$(cd "$(dirname "$0")" && pwd)
hosts_file="$script_dir/hosts.txt"
```

`$(...)` runs a command and keeps its printed output. Use `"$hosts_file"` in the loop, not a bare `hosts.txt`.

**Your script's own exit code** is `exit 0` or `exit 1` at the end. Nothing after `exit` runs. `echo $?` in the terminal, after the script has finished, shows that number.

## What you learn

A script with an exit code, a loop over a file, and the difference between your current folder and the folder the script lives in.

## Submission

Both host files, each followed by `echo $?`, plus one run from a different folder.
