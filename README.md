# 🏠 WG Dashboard v2 — Your Shared Flat's Digital Hub

Welcome to **WG Dashboard v2** — the ultimate tool for managing your shared flat (WG) life!

This is the second iteration of the WG Dashboard. While v1 was tailored for a specific use case, v2 is designed to be customizable and user-friendly for everyone.

🔗 **Live Demo**: [wg-dashboard-v2.nandoerni.com](https://weegee-dashboard.nandoerni.com/)

---

## ✨ Features

* 🎨 **Modern UI**: A sleek and responsive design that looks great on all devices.
* 🖥️ **Touchscreen-Optimized**: Designed with a clean, intuitive interface that works great on wall-mounted tablets and touch displays.
* 📋 **Chore Assignments**: Know exactly who is responsible for what — no more excuses or confusion.
* 📸 **Photo Booth Mode**: Snap fun pictures right from the dashboard using an integrated webcam — perfect for WG parties and guest books!
* 👕 **"What Should I Wear?" Assistant**: Smart clothing suggestions based on current weather and forecasts — no more outfit regrets!
* 🚌 **Live Bus Info**: Real-time updates so you know exactly when to run out the door or chill a bit longer.
* 🗑️ **Garbage Collection Alerts**: Stay on top of trash day with reminders for recycling, compost, and waste pickup.
* ⚙️ **Fully Customizable**: Plug-and-play configuration to suit your WG's unique needs and lifestyle.


---

## 🚀 Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nandoerni/wg-dashboard-v2.git
   cd wg-dashboard-v2
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open your browser and navigate to `http://localhost:3000` to see the dashboard in action.

---

## 🛠 Configuration

Customize your dashboard by editing the `config.js` file:

```javascript
export default {
  flatName: "Awesome WG",
  members: ["Alice", "Bob", "Charlie"],
  features: {
    calendar: true,
    todoList: true,
    announcements: true,
  },
};
```

Adjust the settings to match your WG's preferences.

---

## 📸 Screenshots

![Dashboard Overview](./screenshots/overview.png)
*Dashboard Overview*

![Shared Calendar](./screenshots/calendar.png)
*Shared Calendar*

![To-Do List](./screenshots/todo.png)
*To-Do List*

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues, fork the repository, and create pull requests.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 📬 Contact

For questions or suggestions, please contact [inquiries@nandoerni.com](mailto:inquiries@nandoerni.com).

---

*Made with ❤️ in Winterthur, Zurich, Switzerland*
