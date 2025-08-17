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
- alert
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 3 Issue
- button "Collapse issues badge":
  - img
- main:
  - heading "wish-heading" [level=1]: Your Wishlist
  - heading "You have 2 item(s) wished" [level=2]
  - article:
    - heading "Mocked Item 1" [level=3]
    - paragraph: Added on August 16, 2025
    - paragraph: "Item ID: 101"
    - button "View/Purchase"
    - button "remove remove item":
      - text: remove
      - img "remove item"
  - article:
    - heading "Mocked Item 2" [level=3]
    - paragraph: Added on August 16, 2025
    - paragraph: "Item ID: 102"
    - button "View/Purchase"
    - button "remove remove item":
      - text: remove
      - img "remove item"
  - navigation:
    - button "Back"
```