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
  - heading "Checkout" [level=1]
  - region "Payment Information":
    - heading "Payment Information" [level=2]
    - textbox "Name on Card": Muhannad Tester
    - textbox "Card Number": "4111111111111111"
    - textbox "MM": "12"
    - textbox "YYYY": "2026"
    - textbox "CVV": "123"
    - region "Address Information":
      - heading "Address Information" [level=2]
      - button "Use My Location"
      - textbox "City": Haifa
      - textbox "Street Name or number": 123 Test Street
      - textbox "Postal Code": "12345"
    - button "Pay Now"
  - navigation "Go Back":
    - button "Back"
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message..."
- button "Send"
- alert
- button "Open Next.js Dev Tools":
  - img
```