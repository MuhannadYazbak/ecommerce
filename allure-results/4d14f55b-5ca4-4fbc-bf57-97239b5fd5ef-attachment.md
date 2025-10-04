# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "techMart" [level=1]
  - button "Select Language":
    - img
  - text: hello, guest
  - button "logout"
- main:
  - heading "🥧 adminPieChartTitle" [level=1]
  - navigation:
    - button "back"
    - textbox: 2020-01-01
    - heading "showingFor $2020-01-01" [level=2]
  - paragraph: No chart data to display.
- heading "chatbotTitle" [level=1]
- textbox "typeYourMessage"
- button "send"
- button "⤵️ minimize"
- alert
```