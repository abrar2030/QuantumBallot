/**
 * End-to-End Test: Application Launch and Navigation
 * This tests the app's ability to launch and navigate between screens
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import App from "../../App";

// Mock native modules
jest.mock("expo-font");
jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));
jest.mock("@expo-google-fonts/roboto", () => ({
  useFonts: () => [true],
  Roboto_400Regular: "Roboto_400Regular",
  Roboto_700Bold: "Roboto_700Bold",
}));
jest.mock("expo-secure-store");

describe("E2E: Application", () => {
  it("renders app successfully", async () => {
    const { UNSAFE_root } = render(<App />);

    await waitFor(
      () => {
        expect(UNSAFE_root).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it("displays login screen on initial load", async () => {
    const { getByText } = render(<App />);

    await waitFor(
      () => {
        expect(getByText(/QuantumBallot/i)).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });
});
