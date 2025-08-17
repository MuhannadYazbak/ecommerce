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
  - textbox: Samsung Galaxy S24 Ultra
  - text: Description
  - textbox: Great High-end Android phone with 200MP camera and S Pen.
  - text: Price
  - spinbutton: "1100"
  - text: Photo URL
  - textbox: /images/s24ultra.jpg
  - text: Quantity
  - spinbutton: "9"
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
```