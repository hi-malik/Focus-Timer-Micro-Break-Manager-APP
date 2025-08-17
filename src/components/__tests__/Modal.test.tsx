import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/Modal';

describe('Modal component', () => {
  test('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} title="Test" onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders children and title when open is true', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} title="My Title" onClose={onClose}>
        Hello World
      </Modal>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  test('calls onClose when clicking overlay', () => {
    const onClose = jest.fn();
    render(<Modal open={true} title="Test" onClose={onClose}>Content</Modal>);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when clicking close button', () => {
    const onClose = jest.fn();
    render(<Modal open={true} title="Test" onClose={onClose}>Content</Modal>);
    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when pressing Escape key', () => {
    const onClose = jest.fn();
    render(<Modal open={true} title="Test" onClose={onClose}>Content</Modal>);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
