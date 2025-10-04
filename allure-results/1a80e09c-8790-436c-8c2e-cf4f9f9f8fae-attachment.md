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
  - heading "adminDashboard" [level=1]
  - navigation:
    - button "addNewItem"
    - button "ordersList"
    - button "barChart"
    - button "pieChart"
    - button "byFullName"
  - navigation:
    - button "«" [disabled]
    - button "‹" [disabled]
    - button "›"
    - button "»"
  - navigation:
    - button "back"
- heading "chatbotTitle" [level=1]
- textbox "typeYourMessage"
- button "send"
- button "⤵️ minimize"
- alert: TechMart Admin | Product Management Dashboard
```