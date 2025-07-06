## 🧪 Fake Payment API

This project includes a mocked payment API powered by [Mockoon](https://mockoon.com).  
You’ll find the environment JSON and setup guide in [`/public/fake-payment-api`](public/fake-payment-api).

To simulate payment calls:
1. Import `mockoon-payment-env.json` into Mockoon.
2. Start the server locally (e.g. on port 3001).
3. Frontend calls `http://localhost:3001/pay` to simulate a payment process.