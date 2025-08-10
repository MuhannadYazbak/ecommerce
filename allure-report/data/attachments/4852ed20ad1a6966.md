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
  - region "Login to TechMart":
    - heading "Login to TechMart" [level=1]
    - text: "* Email"
    - textbox: wronguser@example.com
    - text: "* Password"
    - textbox: badpass
    - img "eye-invisible"
    - button "Login"
  - button "Back"
- alert
- button "Open Next.js Dev Tools":
  - img
```