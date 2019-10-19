import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { projects, tasks, ProjectData, TaskData } from "../data";
import Project from "../schemas/Project";

@Resolver(() => Project)
export default class {
  @Query(() => Project, { nullable: true })
  projectByName(@Arg("name") name: string): ProjectData | undefined {
    return projects.find(project => project.name === name);
  }

  @FieldResolver()
  tasks(@Root() projectData: ProjectData): TaskData[] {
    return tasks.filter(task => {
      return task.projectId === projectData.id;
    });
  }
}
