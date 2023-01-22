import React from 'react';
import { render, screen } from '@testing-library/react';
import App from "./App";

test('renders learn react link', () => {
  render(<App />);
  const accounts = screen.getByText('You are not signed in! Please sign in.');
  expect(accounts).toBeInTheDocument();
});
