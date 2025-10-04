# Page snapshot

```yaml
- navigation:
  - img "Logo"
  - heading "techMart" [level=1]
  - button "Select Language":
    - img
  - text: hello, guest
  - button "logout"
  - link:
    - /url: /cart
    - img
- main:
  - heading "myOrders" [level=1]
  - region "no-orders-heading":
    - heading "ordersHistory" [level=2]
    - paragraph: noOrders
    - navigation "Go-Back":
      - button "back"
- heading "chatbotTitle" [level=1]
- textbox "typeYourMessage"
- button "send"
- button "⤵️ minimize"
- alert
```