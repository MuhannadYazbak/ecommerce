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
  - heading "TechMart" [level=1]
  - heading "Welcome to TechMart" [level=2]
  - paragraph: TechMart is your ultimate e-commerce destination for top-notch gadgets and electronics
  - region "Top 5 Products":
    - heading "Top 5 Picks for You" [level=3]
    - button "View details for undefined":
      - img "Buy undefined online at TechMart"
      - heading [level=4]
      - paragraph: ₪
  - text: Continue as a
  - link "Guest":
    - /url: /home
  - text: or, to enjoy full features, please
  - link "login":
    - /url: /login
  - text: or
  - link "register":
    - /url: /register
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert
```