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
  - heading "wish-heading" [level=1]: My Wishlist
  - heading "Empty Wishlist" [level=2]: Looks like you're not wishing for anything yet. Start browsing and add your favorites!
  - navigation:
    - button "backButton": Back
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert: TechMart | Wishlist
```