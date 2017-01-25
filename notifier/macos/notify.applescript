set TITLE to get system attribute "TITLE"
set MESSAGE to get system attribute "MESSAGE"

if TITLE is not "" or MESSAGE is not "" then
  display notification MESSAGE with title TITLE
  return
end if

tell application "System Events"
  if "Terminal" is not in name of processes then return
end tell

tell application "Terminal"
  activate
  repeat with w in windows
    repeat with t in tabs of w
      if "node" is in processes of t then
        set frontmost of w to true
        set selected of t to true
        return
      end if
    end repeat
  end repeat
end tell
