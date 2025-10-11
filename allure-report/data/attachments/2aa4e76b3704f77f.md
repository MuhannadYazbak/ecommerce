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
    - textbox: Automation Test
    - text: "* Arabic Name"
    - textbox
    - text: "'arName' is required * Hebrew Name"
    - textbox
    - text: "'heName' is required * Email"
    - textbox: test@gmail.com
    - text: "* Password"
    - textbox: ABCdef1234
    - img "eye-invisible"
    - text: "* Date of Birth"
    - textbox: 2012-08-13
    - button "Register"
  - button "backButton": Back
- heading "TechMart Chatbot" [level=1]
- textbox "Type your message"
- button "Send"
- button "⤵️ Minimize"
- alert
```