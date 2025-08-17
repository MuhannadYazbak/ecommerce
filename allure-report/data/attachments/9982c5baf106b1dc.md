# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "TechMart" [level=1]
  - text: Hello, Admin User
  - button "Logout"
  - link:
    - /url: /cart
    - img
- main:
  - heading "new item heading" [level=1]: Add New Item
  - heading "Item Details" [level=2]
  - textbox "Name": fail
  - spinbutton
  - textbox "Description"
  - textbox "Quantity"
  - textbox "Photo URL"
  - button "Create Item":
    - text: Create Item
    - img
  - navigation:
    - button "Back"
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message..."
- button "Send"
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
```