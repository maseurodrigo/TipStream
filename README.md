
# Betting Tips Overlay for Streamers

This React-based overlay allows streamers to manage and display betting tips directly on their streams. It includes both single and multiple bet options, with real-time status updates.

---

![TipStream Layout](./tipstream.png)

---

## Features

### Bet Management
- **Add and manage bets**: Easily add single or multiple bets with custom odds and tips.
- **Live status updates**: Update bet status to "green" (win) or "red" (lose) during streams.
- **Edit and delete bets**: Modify bet details or remove bets during the stream.
- **Multiple betting sites**: Support for various betting platforms.
- **Balance types**: Choose between units or currency for bet amounts.

### Display Modes
- **Stream Mode**: Toggle between edit mode and stream-only view for a clean overlay.
- **Carousel Mode**: Automatically rotate through bets with customizable timer (3-30 seconds).
- **Max Height Mode**: Set a fixed height for the tips box with automatic scrolling for overflow content.
- **Multi-column Layout**: Configure the number of bets per column (2-10) for optimal display.

### Profit & Loss Tracking
- **P&L Tracker**: Real-time session profit and loss calculation showing total staked, returns, and net PnL.
- **Balance consistency**: Automatically tracks your betting performance across the session.

### Customization & Appearance
- **Customizable colors**: Adjust base color and header opacity for personalized branding.
- **Header customization**: Toggle header visibility, customize title text, and add your logo.
- **Logo settings**: Upload custom logo with adjustable size (2-5 scale).
- **Resizable tips box**: Drag handles to resize width and height (when max height mode is enabled).

### Sharing & Collaboration
- **Session sharing**: Generate unique viewer URLs to share your betting tips overlay with others.
- **Live viewer count**: Real-time display of connected viewers with animated indicator.
- **WebSocket sync**: Real-time synchronization between editor and viewer sessions.

### Data Export
- **Export to Excel**: Download all your bets to an Excel file for record-keeping and analysis.

## How It Works

1. **Add Tips**: Click the "+" button to open the modal and add single or multiple betting tips with odds and stake amounts.
2. **Manage Bets**: Edit or remove bets, update odds, and change bet status during the stream.
3. **Configure Display**: Click the settings icon to customize appearance, enable carousel mode, adjust P&L tracker, and more.
4. **Toggle Stream Mode**: Switch between edit mode (with controls) and stream mode (clean overlay) using the eye icon.
5. **Share with Viewers**: Copy the session URL from the top-right to share your overlay with viewers who can watch in real-time.
6. **Track Performance**: Monitor your session P&L automatically as bets are marked green (win) or red (lose).
7. **Export Data**: Download all your bets to Excel for analysis and record-keeping.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maseurodrigo/TipStream.git
   cd TipStream
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run start
   ```

4. Use the overlay URL in your streaming software.

## Configuration

Access the configuration modal by clicking the settings icon in the top-right corner.

### Display Options
- **Show Header**: Toggle the header section visibility.
- **Show P&L Tracker**: Enable or disable the profit and loss tracker.
- **Carousel Mode**: Enable automatic bet rotation (mutually exclusive with Max Height Mode).
- **Max Height Mode**: Set a fixed height with auto-scrolling for overflow (mutually exclusive with Carousel Mode).

### Appearance Settings
- **Header Title**: Customize the title text displayed in the header.
- **Logo URL**: Provide an image URL for your custom logo.
- **Logo Size**: Adjust logo size from 2 to 5.
- **Base Color**: Choose your primary color for the overlay theme.
- **Header Color Opacity**: Adjust the opacity of the header background (0-100%).

### Layout Settings
- **Max Bets per Column**: Set how many bets appear per column (2-10) when not in carousel or max height mode.
- **Carousel Timer**: Configure rotation speed in seconds (3-30) when carousel mode is enabled.

### Resizing
- **Width**: Drag the right edge of the tips box to resize width (300-1200px).
- **Height**: When Max Height Mode is enabled, drag the bottom edge to resize height (300-1200px).

## Commands & Actions

### Control Buttons
- **Session URL**: Copy the viewer link to share your overlay with others.
- **Viewer Count**: See how many viewers are currently watching in real-time.
- **Eye Icon**: Toggle between edit mode and stream mode (hide controls for clean overlay).
- **Settings Icon**: Open the configuration modal to customize your overlay.

### Main Actions
- **Add Bet** (+ button, bottom-right): Open the modal to add single or multiple bets.
- **Export to Excel** (download button, bottom-right): Export all bets to an Excel file.
- **Edit Bet**: Click on a bet card to edit its details (only in edit mode).
- **Delete Bet**: Remove a bet from the list (only in edit mode).
- **Change Status**: Click the green or red buttons on a bet to mark it as won or lost.
