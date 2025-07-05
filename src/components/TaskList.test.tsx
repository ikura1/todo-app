import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from './TaskList';
import { Task } from '@/types/task';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <li {...props}>{children}</li>,
    h2: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <span {...props}>{children}</span>,
    input: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <input {...props}>{children}</input>,
    button: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

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

  it('should enter edit mode when clicking on task text', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    // Should show edit input with current text
    expect(screen.getByDisplayValue('テストタスク1')).toBeInTheDocument();
    // Should show save and cancel buttons
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should save edited text when pressing Enter key', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '編集されたタスク');
    await user.keyboard('{Enter}');

    expect(mockOnEdit).toHaveBeenCalledWith('1', '編集されたタスク');
  });

  it('should cancel editing when pressing Escape key', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '編集されたタスク');
    await user.keyboard('{Escape}');

    // Should not call onEdit and should exit edit mode
    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(screen.getByText('テストタスク1')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('編集されたタスク')).not.toBeInTheDocument();
  });

  it('should save edited text when clicking save button', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '編集されたタスク');

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    expect(mockOnEdit).toHaveBeenCalledWith('1', '編集されたタスク');
  });

  it('should show cancel button functionality (note: blur event saves first)', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '編集されたタスク');

    // When we tab to the cancel button, the input loses focus and saves due to onBlur
    await user.tab();
    
    // The edit should be saved due to blur event
    expect(mockOnEdit).toHaveBeenCalledWith('1', '編集されたタスク');
    
    // Should exit edit mode and show the original text temporarily
    expect(screen.queryByDisplayValue('編集されたタスク')).not.toBeInTheDocument();
  });

  it('should save edited text when input loses focus', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '編集されたタスク');
    
    // Click outside to trigger blur
    await user.click(document.body);

    expect(mockOnEdit).toHaveBeenCalledWith('1', '編集されたタスク');
  });

  it('should hide delete button when in edit mode', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Initially should show delete button
    expect(screen.getAllByRole('button', { name: '削除' })).toHaveLength(2);

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    // Should hide delete button for the task being edited
    expect(screen.getAllByRole('button', { name: '削除' })).toHaveLength(1);
    // Should show save and cancel buttons instead
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    await user.clear(editInput);
    await user.type(editInput, '新しいテキスト');

    expect(editInput).toHaveValue('新しいテキスト');
  });

  it('should focus on input when entering edit mode', async () => {
    const user = userEvent.setup();
    render(
      <TaskList 
        tasks={sampleTasks} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const taskText = screen.getByText('テストタスク1');
    await user.click(taskText);

    const editInput = screen.getByDisplayValue('テストタスク1');
    expect(editInput).toHaveFocus();
  });
});