
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Trash2, 
  EllipsisVertical, 
  Palette, 
  Plus, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Star,
  Calendar,
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type TaskStatus = "To Do" | "In Progress" | "Done";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  id: number;
  text: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  isStarred: boolean;
  category?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "All">("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("Medium");
  const [newTaskCategory, setNewTaskCategory] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        status: "To Do",
        priority: newTaskPriority,
        createdAt: new Date(),
        isStarred: false,
        category: newTaskCategory || undefined,
      };
      setTasks([task, ...tasks]);
      setNewTask("");
      setNewTaskCategory("");
      setNewTaskPriority("Medium");
      setShowAddForm(false);
    }
  };

  const handleStatusChange = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const handlePriorityChange = (id: number, priority: TaskPriority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  const handleStarToggle = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isStarred: !task.isStarred } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "High": return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "Medium": return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "Low": return "text-green-500 bg-green-50 dark:bg-green-900/20";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "To Do": return <AlertCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Done": return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Done").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const pending = tasks.filter(t => t.status === "To Do").length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  const renderTasks = (status: TaskStatus) => {
    const statusTasks = filteredTasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        // Starred tasks first, then by priority, then by creation date
        if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1;
        
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return statusTasks.map((task) => (
      <div  
        key={task.id}  
        className={`group flex items-center justify-between rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md ${
          task.status === "Done" ? "opacity-75" : ""
        }`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={() => handleStarToggle(task.id)}
            className={`transition-colors ${task.isStarred ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
          >
            <Star className={`h-4 w-4 ${task.isStarred ? "fill-current" : ""}`} />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium truncate ${task.status === "Done" ? "line-through text-muted-foreground" : ""}`}>
              {task.text}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.category && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {task.category}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Target className="h-4 w-4 mr-2" />
                  Change Status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'To Do')}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'In Progress')}>
                      <Clock className="h-4 w-4 mr-2" />
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'Done')}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Done
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Priority
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => handlePriorityChange(task.id, 'High')}>
                      🔴 High
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handlePriorityChange(task.id, 'Medium')}>
                      🟡 Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handlePriorityChange(task.id, 'Low')}>
                      🟢 Low
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onSelect={() => handleDeleteTask(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ));
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-background p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">TaskEase Pro</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Stay organized and productive with your enhanced task manager
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>  
              <DropdownMenuTrigger asChild>  
                <Button variant="outline" size="icon" className="h-9 w-9">  
                  <Palette className="h-4 w-4" />  
                </Button>  
              </DropdownMenuTrigger>  
              <DropdownMenuContent align="end">  
                <DropdownMenuSub>  
                  <DropdownMenuSubTrigger>  
                    <Palette className="h-4 w-4 mr-2" />
                    <span>Themes</span>  
                  </DropdownMenuSubTrigger>  
                  <DropdownMenuPortal>  
                    <DropdownMenuSubContent>  
                      <DropdownMenuItem onSelect={() => setTheme("light")}>  
                        ☀️ Light  
                      </DropdownMenuItem>  
                      <DropdownMenuItem onSelect={() => setTheme("dark")}>  
                        🌙 Dark  
                      </DropdownMenuItem>  
                       <DropdownMenuItem onSelect={() => setTheme("ocean")}>  
                        🌊 Ocean  
                      </DropdownMenuItem>  
                       <DropdownMenuItem onSelect={() => setTheme("sunset")}>  
                        🌅 Sunset  
                      </DropdownMenuItem>  
                    </DropdownMenuSubContent>  
                  </DropdownMenuPortal>  
                </DropdownMenuSub>  
              </DropdownMenuContent>  
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filterPriority === "All" ? "All Priorities" : filterPriority}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setFilterPriority("All")}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilterPriority("High")}>
                🔴 High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterPriority("Medium")}>
                🟡 Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilterPriority("Low")}>
                🟢 Low Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Add Task Section */}
        {!showAddForm ? (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 h-12 text-base gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Task
          </Button>
        ) : (
          <Card className="mb-6 border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  className="text-base"
                  autoFocus
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Category (optional)"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="flex-1"
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        Priority: {newTaskPriority}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setNewTaskPriority("High")}>
                        🔴 High
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setNewTaskPriority("Medium")}>
                        🟡 Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setNewTaskPriority("Low")}>
                        🟢 Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} className="flex-1" disabled={!newTask.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTask("");
                      setNewTaskCategory("");
                      setNewTaskPriority("Medium");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round((stats.completed / stats.total) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Task Columns - Mobile First Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">  
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">  
            <CardHeader className="pb-3">  
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                To Do
                <span className="ml-auto text-sm bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full">
                  {filteredTasks.filter(t => t.status === "To Do").length}
                </span>
              </CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">  
              {renderTasks("To Do").length > 0 ? renderTasks("To Do") : 
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No pending tasks</p>
                </div>
              }  
            </CardContent>  
          </Card>  

          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">  
            <CardHeader className="pb-3">  
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
                In Progress
                <span className="ml-auto text-sm bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                  {filteredTasks.filter(t => t.status === "In Progress").length}
                </span>
              </CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">  
              {renderTasks("In Progress").length > 0 ? renderTasks("In Progress") : 
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No active tasks</p>
                </div>
              }  
            </CardContent>  
          </Card>  

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">  
            <CardHeader className="pb-3">  
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Done
                <span className="ml-auto text-sm bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                  {filteredTasks.filter(t => t.status === "Done").length}
                </span>
              </CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">  
              {renderTasks("Done").length > 0 ? renderTasks("Done") : 
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No completed tasks</p>
                </div>
              }  
            </CardContent>  
          </Card>  
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Ready to be productive?</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding your first task and take control of your day!
              </p>
              <Button onClick={() => setShowAddForm(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}