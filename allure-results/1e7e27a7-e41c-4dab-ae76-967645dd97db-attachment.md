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
  - textbox "name": New Item
  - textbox "description": A great item
  - spinbutton: "99.99"
  - textbox "quantity": "10"
  - textbox "photoURL": https://example.com/photo.jpg
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