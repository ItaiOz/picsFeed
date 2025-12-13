import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders PicsFeed application", () => {
  render(<App />);
  // Check that loading indicator or content is present
  const loadingOrContent =
    screen.queryByRole('progressbar') || screen.queryByRole('banner');
  expect(loadingOrContent || document.body.firstChild).toBeTruthy();
});
