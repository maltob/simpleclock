# Simpe Web Clock

A full-screen digital clock designed specifically for static hosting. Featuring a weekly schedule editor, and URL based state management—all your settings and schedules are stored directly in the URL fragment.

[Preview here](https://maltob.github.io/simpleclock/#size=400&color=%23a4d8e5&bg=%23081e06&font=system-ui%2C+sans-serif&h24=true&s=false&sm=list&d0=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d1=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d2=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d3=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d4=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d5=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&d6=488-Activity+1%7C728-Activity+2%7C1208-Activity+3%7C1392-Activity+4&img=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1547312667-da746e5a78c7%3Fixlib%3Drb-4.1.0%26q%3D85%26fm%3Djpg%26crop%3Dentropy%26cs%3Dsrgb%26dl%3Dkarl-kohler-a80xLtm_tMQ-unsplash.jpg%26w%3D1920&imgOp=0.12&txt=Test+Instance+%28Alt+%2B+S+for+settings%29) 

## Usage

- **Toggle Settings**: Press `Alt + S` to open/close the settings panel.
- **Edit Schedule**: In the settings panel, click **"Edit Weekly Schedule"** to open the interactive editor.
- **Share**: Your URL fragment (e.g., `#size=250&color=%23ffffff...`) updates in real-time. Just copy the URL to save or share your configuration.


## Key Features

- **Full-Screen Digital Clock**: Minimalist, high-contrast display with some attempted monospacing layout.
- **Weekly Schedule Manager**: 
  - Visual row-based editor (Tabs for Mon-Sun).
  - "Copy From" feature to easily duplicate agendas between days.
  - Automatic current-day detection.
- **Event Countdown**: A discrete, bottom-aligned banner showing the time until your next scheduled activity (e.g., *"Next: Recess in 5m"*).
- **Customization**: Change fonts (Web Safe & Modern), sizes, colors, and background images with adjustable opacity.
- **Alt + S Settings**: Access all configuration options via a keyboard shortcut (`Alt + S`) - so there is a clean UI.
- **URL-Based Persistence**: Share your exact setup (including the entire weekly schedule) by simply copying the URL. No database required.

## Deployment

This repository includes a **GitHub Actions** workflow that automatically deploys your clock to GitHub Pages whenever you push to the `main` branch.

1. **Fork or Clone** this repository.
2. **Push** to your own GitHub account.
3. Go to **Settings > Pages** and ensure "Build and deployment" is set to **"GitHub Actions"**.

