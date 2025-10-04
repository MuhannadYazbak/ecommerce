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
  - region "registerTitle":
    - heading "registerTitle" [level=1]
    - text: "* enName"
    - textbox: Automation Test
    - text: "* arName"
    - textbox
    - text: "'arName' is required * heName"
    - textbox
    - text: "'heName' is required * email"
    - textbox: test@gmail.com
    - text: "* password"
    - textbox: ABCdef1234
    - img "eye-invisible"
    - text: "* dob"
    - textbox: 2012-08-13
    - button "register"
  - button "back"
- heading "chatbotTitle" [level=1]
- textbox "typeYourMessage"
- button "send"
- button "⤵️ minimize"
- alert
```