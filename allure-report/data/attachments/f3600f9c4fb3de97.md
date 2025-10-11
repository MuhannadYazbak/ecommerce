# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "TechMart" [level=1]
  - button "Select Language":
    - img
  - text: Hello, Muhannad Yazbak
  - button "Logout"
- main:
  - heading "new item heading" [level=1]: Add New Item
  - heading "Item Details" [level=2]
  - textbox "Name": New Item
  - textbox "Description": A great item
  - textbox "Name": منتج جديد
  - textbox "Description": מוצר מדהים
  - textbox "Name": מוצר חדש
  - textbox "Description": منتج رائع
  - spinbutton
  - textbox "Quantity"
  - textbox "Photo URL"
  - button "Add New Item":
    - text: Add New Item
    - img
  - navigation:
    - button "backButton": Back
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert
```