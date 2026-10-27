/**
 * Tests for small presentational components: Loading, NewsItem, Header,
 * ProgressHeader and PinItem, plus the useImage hook.
 */
import {
  act,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react-native";
import React from "react";
import { Image } from "react-native";

const mockOnLogOut = jest.fn();

jest.mock("src/context/AuthContext", () => ({
  useAuth: () => ({ onLogOut: mockOnLogOut }),
}));

import { Header } from "src/components/Header";
import { Loading } from "src/components/Loading";
import { NewsItem } from "src/components/NewsItem";
import { PinItem } from "src/components/PinItem";
import { ProgressHeader } from "src/components/ProgressHeader";
import useImage from "src/hooks/useImage";

describe("Loading", () => {
  it("renders without crashing", () => {
    expect(() => render(<Loading />)).not.toThrow();
  });
});

describe("NewsItem", () => {
  it("renders title, timestamp and people", () => {
    const { getByText } = render(
      <NewsItem
        title="Polls open"
        timestamp="09:00"
        people="1,204"
        src={1 as any}
      />,
    );
    expect(getByText("Polls open")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
    expect(getByText("1,204")).toBeTruthy();
  });
});

describe("Header", () => {
  it("logs out and navigates to Login when LogOut is pressed", () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<Header navigation={navigation} />);
    fireEvent.press(getByText("LogOut"));
    expect(mockOnLogOut).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalledWith("Login");
  });
});

describe("ProgressHeader", () => {
  it("renders for different progress values", () => {
    expect(() => render(<ProgressHeader number="0" key="a" />)).not.toThrow();
    expect(() => render(<ProgressHeader number="3" key="b" />)).not.toThrow();
  });
});

describe("PinItem", () => {
  const makeProps = (overrides: Record<string, unknown> = {}) => ({
    number: "5",
    token: "",
    setToken: jest.fn(),
    numCodes: ["11", "12", "13", "14", "15", "16"],
    setNumCodes: jest.fn(),
    setIsRefresh: jest.fn(),
    ...overrides,
  });

  it("appends the digit to the token when pressed", () => {
    const props = makeProps({ token: "12" });
    const { getByText } = render(<PinItem {...(props as any)} />);
    fireEvent.press(getByText("5"));
    expect(props.setToken).toHaveBeenCalledWith("125");
    expect(props.setNumCodes).toHaveBeenCalled();
  });

  it("ignores digits once the PIN is complete", () => {
    const props = makeProps({ token: "123456" });
    const { getByText } = render(<PinItem {...(props as any)} />);
    fireEvent.press(getByText("5"));
    expect(props.setToken).not.toHaveBeenCalled();
  });

  it("removes the last digit on delete", () => {
    const props = makeProps({ number: "del", token: "123" });
    const { UNSAFE_getByType } = render(<PinItem {...(props as any)} />);
    const { TouchableOpacity } = require("react-native");
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(props.setToken).toHaveBeenCalledWith("12");
  });

  it("does nothing on delete when the token is empty", () => {
    const props = makeProps({ number: "del", token: "" });
    const { UNSAFE_getByType } = render(<PinItem {...(props as any)} />);
    const { TouchableOpacity } = require("react-native");
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(props.setToken).not.toHaveBeenCalled();
  });

  it("recomputes the PIN indicator state", () => {
    const props = makeProps({ token: "1" });
    const { getByText } = render(<PinItem {...(props as any)} />);
    fireEvent.press(getByText("5"));
    const updater = props.setNumCodes.mock.calls[0][0];
    const next = updater(["", "", "", "", "", ""]);
    expect(next).toEqual(["0", "1", "13", "14", "15", "16"]);
  });
});

describe("useImage", () => {
  afterEach(() => jest.restoreAllMocks());

  it("stays not loaded when there is no src", () => {
    const { result } = renderHook(() => useImage({ src: null }));
    expect(result.current).toEqual({ loaded: false, error: false });
  });

  it("reports loaded when the prefetch succeeds", async () => {
    jest.spyOn(Image, "prefetch").mockResolvedValue(true);
    const { result } = renderHook(() => useImage({ src: "http://x/y.png" }));
    await act(async () => {});
    expect(result.current.loaded).toBe(true);
    expect(result.current.error).toBe(false);
  });

  it("reports an error when the prefetch fails", async () => {
    jest.spyOn(Image, "prefetch").mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useImage({ src: "http://x/y.png" }));
    await act(async () => {});
    expect(result.current.error).toBe(true);
    expect(result.current.loaded).toBe(false);
  });
});
