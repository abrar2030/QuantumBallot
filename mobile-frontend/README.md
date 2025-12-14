# QuantumBallot Mobile Frontend

React Native mobile application for secure blockchain-based voting system.

## Features

- 🔐 Secure authentication with JWT
- 📱 Cross-platform (iOS & Android) support via Expo
- 🗳️ Vote casting interface with candidate selection
- 📊 Real-time election results and projections
- 🔍 QR code scanning for verification
- 📰 Election news and announcements
- 🔒 Two-factor authentication support
- 📡 Offline-ready architecture

## Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: macOS with Xcode
- For Android: Android Studio with SDK
- Expo Go app on your mobile device (for testing)

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend API URL (default: `http://192.168.0.38:3010/api`)

3. **Start development server:**

   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator:**

   ```bash
   # Android
   npm run android

   # iOS (macOS only)
   npm run ios

   # Web (for testing)
   npm run web
   ```

## Configuration

### API Endpoint Configuration

The API base URL can be configured in `src/constants/config.ts`:

```typescript
const DEFAULT_API_BASE_URL = "http://192.168.0.38:3010";
```

For local development, replace `192.168.0.38` with your machine's IP address:

- Find your IP: `ipconfig` (Windows) or `ifconfig` (macOS/Linux)
- Update the URL in `config.ts`

### Backend Requirements

The mobile app requires the QuantumBallot backend API to be running. From the project root:

```bash
cd backend-api
npm install
npm run dev
```

The backend should be accessible at `http://<YOUR_IP>:3010`

## Project Structure

```
mobile-frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── BottomNavigation/
│   │   ├── CameraQR/
│   │   ├── CandidateItem/
│   │   ├── CandidatesList/
│   │   └── ...
│   ├── screens/          # Screen components
│   │   ├── Login/
│   │   ├── Registration/
│   │   ├── Candidates/
│   │   ├── Groups/       # Voting interface
│   │   └── ...
│   ├── routes/           # Navigation configuration
│   ├── context/          # React Context (Auth, etc.)
│   ├── api/              # API client configuration
│   ├── constants/        # App configuration
│   ├── utils/            # Utility functions
│   └── assets/           # Images, fonts, etc.
├── __tests__/            # Test files
├── App.tsx               # Root component
├── package.json
└── tsconfig.json
```

## Testing

### Run all tests:

```bash
npm test
```

### Run tests in watch mode:

```bash
npm run test:watch
```

### Run tests with coverage:

```bash
npm run test:coverage
```

### Test Structure:

- `__tests__/screens/` - Screen component tests
- `__tests__/components/` - Component tests
- `__tests__/integration/` - Integration tests
- `__tests__/api/` - API client tests

## Development Workflow

### 1. Start Backend

```bash
cd ../backend-api
npm run dev
```

### 2. Start Mobile App

```bash
npm start
```

### 3. Test on Device

- Install Expo Go app on your phone
- Scan QR code from terminal
- Or use emulator: `npm run android` / `npm run ios`

### 4. Development Cycle

- Make changes to source files
- App will hot-reload automatically
- Check console for errors
- Test on device/emulator

## Building for Production

### Android APK:

```bash
expo build:android
```

### iOS IPA:

```bash
expo build:ios
```

### Using EAS Build (Recommended):

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Common Issues & Solutions

### Issue: "Network request failed"

**Solution:** Ensure backend is running and accessible. Check IP address in config.

### Issue: "Unable to resolve module"

**Solution:** Clear cache and reinstall:

```bash
rm -rf node_modules
npm install
expo start -c
```

### Issue: "Metro bundler fails to start"

**Solution:** Kill any processes on port 8081:

```bash
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Issue: Cannot connect to backend from device

**Solution:**

1. Ensure device and computer are on same network
2. Use computer's IP address (not localhost)
3. Check firewall settings
4. Verify backend is accessible: `curl http://<YOUR_IP>:3010/api/committee/candidates`

## Key Screens

### Login Screen (`src/screens/Login`)

- Electoral ID and password authentication
- Link to registration
- Error handling and validation

### Registration Screen (`src/screens/Registration`)

- New voter registration
- Form validation
- State selection
- Password strength requirements

### Groups Screen (`src/screens/Groups`)

- Main voting interface
- Candidate selection
- Vote submission with confirmation
- Blockchain transaction handling

### Candidates Screen (`src/screens/Candidates`)

- Browse all candidates
- View candidate details
- Live election projections

### Two-Factor Authentication (`src/screens/TwoFactor`)

- OTP verification
- QR code scanning
- Email-based 2FA

## API Integration

The app integrates with these backend endpoints:

- `POST /api/committee/auth-mobile` - Login
- `POST /api/committee/register-voter` - Registration
- `GET /api/committee/candidates` - Get candidates
- `GET /api/committee/announcement` - Get election details
- `GET /api/committee/refresh-token` - Refresh JWT
- `POST /api/committee/verify-otp` - 2FA verification
- `POST /blockchain/make-transaction` - Submit vote

## Security Considerations

- JWT tokens stored in Expo SecureStore
- Passwords never stored locally
- HTTPS recommended for production
- Token refresh mechanism
- Session timeout handling

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test thoroughly
3. Run tests: `npm test`
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

## License

MIT License - see LICENSE file for details
