# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "TechMart" [level=1]
  - text: Hello, Test User
  - button "Logout"
  - link:
    - /url: /cart
    - img
- main:
  - heading "Your Orders" [level=1]
  - region "no-orders-heading":
    - heading "Order History" [level=2]
    - paragraph: No orders found.
    - navigation "Go-Back":
      - button "Back"
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message..."
- button "Send"
- alert
- button "Open Next.js Dev Tools":
  - img
```