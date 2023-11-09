// Import your component
import React from 'react'; // Import React
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter for testing
import Login from './Login';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  };
});

test('renders Login', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  // Your test assertions here
});
