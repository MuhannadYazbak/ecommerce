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
  - heading "new item heading" [level=1]: addNewItem
  - heading "itemDetails" [level=2]
  - textbox "name": fail
  - textbox "description"
  - spinbutton
  - textbox "quantity"
  - textbox "photoURL"
  - button "addNewItem":
    - text: addNewItem
    - img
  - navigation:
    - button "back"
- heading "chatbotTitle" [level=1]
- textbox "typeYourMessage"
- button "send"
- button "⤵️ minimize"
- alert
```