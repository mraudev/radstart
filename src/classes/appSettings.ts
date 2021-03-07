import { IProject } from "@/types";
import settings from "electron-settings";
import path from "path";
import fs from "fs";

export class AppSettings {
   appSetting: any = settings;

   constructor() {
      this.appSetting.configure({ numSpaces: 3, prettify: true });

      this.validateProjects();
   }

   validateProjects() {
      let projectData: Array<IProject> = [];
      const allProjects: Array<IProject> = this.get("projects");
      if (allProjects !== undefined) {
         for (let i: number = 0; i < allProjects.length; ++i) {
            let project: IProject = allProjects[i];
            const hasApp: boolean = "apps" in project;
            if (!hasApp) {
               project.apps = [];
               const allPath = path.join(project.path, "All.groupproj");
               if (!project.apps.includes(allPath) && fs.existsSync(allPath)) {
                  project.apps.push(allPath);
               }
               const allComp = path.join(
                  project.path,
                  "AllComponents.groupproj",
               );
               if (!project.apps.includes(allComp) && fs.existsSync(allComp)) {
                  project.apps.push(allComp);
               }
            }
            projectData.push(allProjects[i]);
         }
      }
      this.set("projects", allProjects);
   }

   set(key: string, value: any) {
      this.appSetting.setSync(key, value);
   }
   get(key: string): any {
      return this.appSetting.getSync(key);
   }
}

const appSetting = new AppSettings();
export default appSetting;
