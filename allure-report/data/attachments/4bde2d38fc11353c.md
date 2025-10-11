# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "TechMart" [level=1]
  - button "Select Language":
    - img
  - text: Hello, Guest
  - button "Logout"
  - link:
    - /url: /cart
    - img
- main:
  - heading "My Orders" [level=1]
  - region "no-orders-heading":
    - heading "Orders History" [level=2]
    - paragraph: No Previous Orders to Show
    - navigation "Go-Back":
      - button "backButton": Back
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert
```