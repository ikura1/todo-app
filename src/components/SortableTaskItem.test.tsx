import { render, screen, fireEvent } from '@testing-library/react';
import { SortableTaskItem } from './SortableTaskItem';
import { Task } from '@/types/task';

// Mock @dnd-kit/sortable
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock @dnd-kit/utilities
jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    li: ({ children, className, ...props }: any) => (
      <li className={className} {...props}>{children}</li>
    ),
    input: ({ className, ...props }: any) => (
      <input className={className} {...props} />
    ),
    span: ({ children, className, onClick, ...props }: any) => (
      <span className={className} onClick={onClick} {...props}>{children}</span>
    ),
    button: ({ children, className, onClick, ...props }: any) => (
      <button className={className} onClick={onClick} {...props}>{children}</button>
    ),
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
}));

describe('SortableTaskItem', () => {
  const mockTask: Task = {
    id: '1',
    text: 'テストタスク',
    completed: false,
    priority: 'high',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockProps = {
    task: mockTask,
    index: 0,
    onToggleComplete: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task correctly', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('🔥 高')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  test('renders drag handle', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const dragHandle = document.querySelector('.cursor-grab');
    expect(dragHandle).toBeInTheDocument();
  });

  test('calls onToggleComplete when checkbox is clicked', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith('1');
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('starts editing when task text is clicked', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const taskText = screen.getByText('テストタスク');
    fireEvent.click(taskText);
    
    expect(screen.getByDisplayValue('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  test('saves edit when Enter key is pressed', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const taskText = screen.getByText('テストタスク');
    fireEvent.click(taskText);
    
    const input = screen.getByDisplayValue('テストタスク');
    fireEvent.change(input, { target: { value: '編集されたタスク' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockProps.onEdit).toHaveBeenCalledWith('1', '編集されたタスク');
  });

  test('cancels edit when Escape key is pressed', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const taskText = screen.getByText('テストタスク');
    fireEvent.click(taskText);
    
    const input = screen.getByDisplayValue('テストタスク');
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('テストタスク')).not.toBeInTheDocument();
  });

  test('saves edit when save button is clicked', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const taskText = screen.getByText('テストタスク');
    fireEvent.click(taskText);
    
    const input = screen.getByDisplayValue('テストタスク');
    fireEvent.change(input, { target: { value: '編集されたタスク' } });
    
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith('1', '編集されたタスク');
  });

  test('cancels edit when cancel button is clicked', () => {
    render(<SortableTaskItem {...mockProps} />);
    
    const taskText = screen.getByText('テストタスク');
    fireEvent.click(taskText);
    
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('テストタスク')).not.toBeInTheDocument();
  });

  test('shows completed task styling', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<SortableTaskItem {...mockProps} task={completedTask} />);
    
    const taskText = screen.getByText('テストタスク');
    expect(taskText).toHaveClass('line-through');
  });

  test('shows correct checkbox state', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<SortableTaskItem {...mockProps} task={completedTask} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});