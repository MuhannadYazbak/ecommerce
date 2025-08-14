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
  - region "Create Your TechMart Account":
    - heading "Create Your TechMart Account" [level=1]
    - text: "* Name"
    - textbox: Test User
    - text: "* Email"
    - textbox: Notalready@used.com
    - text: "* Password"
    - textbox: SecureP@ssw0rd
    - img "eye-invisible"
    - text: "* Date of Birth"
    - textbox: 2030-05-15
    - button "Register"
    - paragraph: Date can't be in the future.
  - button "Back"
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message..."
- button "Send"
- alert
- button "Open Next.js Dev Tools":
  - img
```