import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLayout from "./page-layout";

test('renders learn react link', () => {
  render(<PageLayout />);
  const accounts = screen.getByText('Accounts');
  expect(accounts).toBeInTheDocument();
});
