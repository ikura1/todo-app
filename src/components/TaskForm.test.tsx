import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render task input form', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted with valid text', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'テストタスク');
    await user.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      text: 'テストタスク',
      priority: 'medium',
      category: undefined,
      dueDate: undefined,
    });
  });

  it('should not call onSubmit when form is submitted with empty text', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const button = screen.getByRole('button', { name: '追加' });
    await user.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should clear input after successful submission', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'テストタスク');
    await user.click(button);

    expect(input).toHaveValue('');
  });

  it('should submit form when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');

    await user.type(input, 'テストタスク');
    await user.keyboard('{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith({
      text: 'テストタスク',
      priority: 'medium',
      category: undefined,
      dueDate: undefined,
    });
  });

  it('should show loading state when isLoading is true', () => {
    render(<TaskForm onSubmit={mockOnSubmit} isLoading={true} />);

    const button = screen.getByRole('button', { name: '追加中...' });
    expect(button).toBeDisabled();
  });
});