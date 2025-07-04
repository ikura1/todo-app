import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';
import { Task } from '@/types/task';

describe('TaskList', () => {
  const mockOnToggleComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const sampleTasks: Task[] = [
    {
      id: '1',
      text: 'テストタスク1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium'
    },
    {
      id: '2',
      text: 'テストタスク2',
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'high'
    }
  ];

  beforeEach(() => {
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  it('should render empty state when no tasks', () => {
    render(
      <TaskList 
        tasks={[]} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('まだタスクがありません。上のフォームから追加してください。')).toBeInTheDocument();
  });

  it('should render task list with tasks', () => {
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.getByText('テストタスク2')).toBeInTheDocument();
    expect(screen.getByText('タスク一覧 (2)')).toBeInTheDocument();
  });

  it('should call onToggleComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith('1');
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should show completed tasks with strikethrough', () => {
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const completedTaskText = screen.getByText('テストタスク2');
    expect(completedTaskText).toHaveClass('line-through');
  });

  it('should show priority for each task', () => {
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});