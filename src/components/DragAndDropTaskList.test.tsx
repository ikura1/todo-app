import { render, screen, fireEvent } from '@testing-library/react';
import { DragAndDropTaskList } from './DragAndDropTaskList';
import { Task } from '@/types/task';

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
}));

// Mock @dnd-kit/sortable
jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, transition, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
    h2: ({ children, className, ...props }: any) => (
      <h2 className={className} {...props}>{children}</h2>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>{children}</p>
    ),
    li: ({ children, className, ...props }: any) => (
      <li className={className} {...props}>{children}</li>
    ),
  },
}));

// Mock the SortableTaskItem component
jest.mock('./SortableTaskItem', () => ({
  SortableTaskItem: ({ task, onToggleComplete, onDelete, onEdit }: any) => (
    <div data-testid={`sortable-task-${task.id}`}>
      <span>{task.text}</span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        data-testid={`checkbox-${task.id}`}
      />
      <button onClick={() => onDelete(task.id)} data-testid={`delete-${task.id}`}>
        削除
      </button>
      <button onClick={() => onEdit(task.id, 'edited text')} data-testid={`edit-${task.id}`}>
        編集
      </button>
    </div>
  ),
}));

describe('DragAndDropTaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      text: 'テストタスク1',
      completed: false,
      priority: 'high',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      text: 'テストタスク2',
      completed: true,
      priority: 'medium',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  const mockProps = {
    tasks: mockTasks,
    onToggleComplete: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onTasksReorder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no tasks', () => {
    render(<DragAndDropTaskList {...mockProps} tasks={[]} />);
    
    expect(screen.getByText('タスク一覧 (0)')).toBeInTheDocument();
    expect(screen.getByText('まだタスクがありません。上のフォームから追加してください。')).toBeInTheDocument();
  });

  test('renders tasks correctly', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    expect(screen.getByText('タスク一覧 (2)')).toBeInTheDocument();
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
  });

  test('renders DndContext and SortableContext', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
  });

  test('renders SortableTaskItem for each task', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    expect(screen.getByTestId('sortable-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-task-2')).toBeInTheDocument();
  });

  test('calls onToggleComplete when checkbox is clicked', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    const checkbox = screen.getByTestId('checkbox-1');
    fireEvent.click(checkbox);
    
    expect(mockProps.onToggleComplete).toHaveBeenCalledWith('1');
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith('1', 'edited text');
  });

  test('renders drag overlay container', () => {
    render(<DragAndDropTaskList {...mockProps} />);
    
    expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
  });
});