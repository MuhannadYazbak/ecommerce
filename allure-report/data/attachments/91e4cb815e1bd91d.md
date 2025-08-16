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
  - 'heading "Edit Item #2" [level=1]'
  - text: Name
  - textbox: Test Item
  - text: Description
  - textbox: Mocked item for testing
  - text: Price
  - spinbutton: "-999"
  - text: Photo URL
  - textbox: test-photo.jpg
  - text: Quantity
  - spinbutton: "10"
  - navigation:
    - button "Update"
    - button "Cancel"
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