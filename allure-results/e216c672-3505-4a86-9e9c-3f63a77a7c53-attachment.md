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
  - region "Create Your TechMart Account":
    - heading "Create Your TechMart Account" [level=1]
    - text: "* English Name"
    - textbox: Test User
    - text: "* Arabic Name"
    - textbox
    - text: "'arName' is required * Hebrew Name"
    - textbox
    - text: "'heName' is required * Email"
    - textbox: Notalready@used.com
    - text: "* Password"
    - textbox: SecureP@ssw0rd
    - img "eye-invisible"
    - text: "* Date of Birth"
    - textbox: 2000-05-15
    - button "Register"
  - button "backButton": Back
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert
```