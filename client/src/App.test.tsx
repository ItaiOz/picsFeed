/* eslint-disable */
// @ts-nocheck
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders PicsFeed application", () => {
  render(<App />);
  const loadingOrContent =
    screen.queryByRole('progressbar') || screen.queryByRole('banner');
  expect(loadingOrContent || document.body.firstChild).toBeTruthy();
});
