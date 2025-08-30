"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, EllipsisVertical, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

type TaskStatus = "To Do" | "In Progress" | "Done";

interface Task {
  id: number;
  text: string;
  status: TaskStatus;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, status: "To Do" }]);
      setNewTask("");
    }
  };

  const handleStatusChange = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const renderTasks = (status: TaskStatus) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div  
          key={task.id}  
          className="flex items-center justify-between rounded-lg border bg-card p-4"  
        >
          <div className="flex items-center space-x-4">
            <label
              htmlFor={`task-${task.id}`}
              className="text-sm font-medium"
            >
              {task.text}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'To Do')}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'In Progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleStatusChange(task.id, 'Done')}>
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteTask(task.id)}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ));
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-start bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center w-full">
          <CardHeader className="px-0 flex-grow">
            <CardTitle className="text-3xl font-bold text-center">My To-Do List</CardTitle>
            <CardDescription className="text-center">What do you need to get done today?</CardDescription>
          </CardHeader>

          <DropdownMenu>  
            <DropdownMenuTrigger asChild>  
              <Button variant="outline" size="icon">  
                <Palette className="h-4 w-4" />  
              </Button>  
            </DropdownMenuTrigger>  
            <DropdownMenuContent align="end">  
              <DropdownMenuSub>  
                <DropdownMenuSubTrigger>  
                  <span>Themes</span>  
                </DropdownMenuSubTrigger>  
                <DropdownMenuPortal>  
                  <DropdownMenuSubContent>  
                    <DropdownMenuItem onSelect={() => setTheme("light")}>  
                      Light  
                    </DropdownMenuItem>  
                    <DropdownMenuItem onSelect={() => setTheme("dark")}>  
                      Dark  
                    </DropdownMenuItem>  
                     <DropdownMenuItem onSelect={() => setTheme("ocean")}>  
                      Ocean  
                    </DropdownMenuItem>  
                     <DropdownMenuItem onSelect={() => setTheme("sunset")}>  
                      Sunset  
                    </DropdownMenuItem>  
                  </DropdownMenuSubContent>  
                </DropdownMenuPortal>  
              </DropdownMenuSub>  
            </DropdownMenuContent>  
          </DropdownMenu>  
        </div>  


        <div className="flex w-full items-center space-x-2 mb-6">  
          <Input  
            type="text"  
            placeholder="E.g., Finish the report"  
            value={newTask}  
            onChange={(e) => setNewTask(e.target.value)}  
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}  
            className="flex-grow"  
          />  
          <Button onClick={handleAddTask}>Add Task</Button>  
        </div>  

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">  
          <Card className="bg-red-50 dark:bg-red-900/20">  
            <CardHeader>  
              <CardTitle>To Do</CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-4">  
              {renderTasks("To Do").length > 0 ? renderTasks("To Do") : <p className="text-center text-muted-foreground py-4">No tasks here.</p>}  
            </CardContent>  
          </Card>  

          <Card className="bg-yellow-50 dark:bg-yellow-900/20">  
            <CardHeader>  
              <CardTitle>In Progress</CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-4">  
              {renderTasks("In Progress").length > 0 ? renderTasks("In Progress") : <p className="text-center text-muted-foreground py-4">No tasks here.</p>}  
            </CardContent>  
          </Card>  

          <Card className="bg-green-50 dark:bg-green-900/20">  
            <CardHeader>  
              <CardTitle>Done</CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-4">  
              {renderTasks("Done").length > 0 ? renderTasks("Done") : <p className="text-center text-muted-foreground py-4">No tasks here.</p>}  
            </CardContent>  
          </Card>  
        </div>  
      </div>  
    </main>
  );
}