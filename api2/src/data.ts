export interface ProjectData {
  id: number;
  name: string;
}

export interface TaskData {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
}

export const projects: ProjectData[] = [{ id: 1, name: "Learn React Native" }, { id: 2, name: "Workout" }];

export const tasks: TaskData[] = [
  { id: 1, title: "Install Node", completed: true, projectId: 1 },
  { id: 2, title: "Install React Native CLI", completed: false, projectId: 1 },
  { id: 3, title: "Install Xcode", completed: false, projectId: 1 },
  { id: 4, title: "Morning Jog", completed: true, projectId: 2 },
  { id: 5, title: "Visit the gym", completed: false, projectId: 2 }
];
