# Quick Local Quiz

A React Native app that shows random local trivia using Mapbox and OpenAI GPT-4.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your Mapbox access token and OpenAI API key:
  ```
  MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
  OPENAI_API_KEY=your_openai_api_key_here
  ```

3. iOS Setup:
```bash
cd ios
pod install
cd ..
npm run ios
```

4. Android Setup:
- Add your Mapbox access token to `android/app/src/main/res/values/strings.xml`
- Enable location permissions in `android/app/src/main/AndroidManifest.xml`
```bash
npm run android
```

## Features

- Full-screen Mapbox map centered on user's location
- Random location selection with "Surprise me!" button
- AI-powered fun facts about locations
- Interactive markers and callouts
- Location-based trivia

## Requirements

- Node.js >= 14
- React Native development environment set up
- Mapbox account and access token
- OpenAI API key
- iOS: XCode (for iOS development)
- Android: Android Studio (for Android development)

## Troubleshooting

- If you encounter location permission issues, make sure to grant location access to the app in your device settings
- For Mapbox issues, verify your access token and ensure proper configuration in both iOS and Android projects
- For OpenAI API issues, check your API key and internet connectivity