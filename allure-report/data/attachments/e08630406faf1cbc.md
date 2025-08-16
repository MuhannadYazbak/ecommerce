# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "TechMart" [level=1]
  - text: Hello, Test User
  - button "Logout"
- main:
  - heading "Checkout" [level=1]
  - region "Payment Information":
    - heading "Payment Information" [level=2]
    - textbox "Name on Card"
    - textbox "Card Number"
    - textbox "MM"
    - textbox "YYYY"
    - textbox "CVV"
    - region "Address Information":
      - heading "Address Information" [level=2]
      - button "Use My Location"
      - textbox "City"
      - textbox "Street Name or number"
      - textbox "Postal Code"
    - button "Pay Now"
  - navigation "Go Back":
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