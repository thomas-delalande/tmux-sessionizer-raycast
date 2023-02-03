import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { exec } from "child_process";
import { readdirSync } from "fs";
import { useEffect, useState } from "react";

export default function Command() {
  const [projects, setProjects] = useState<string[]>([]);
  const directory = "/Users/thomas-delalande/vgw/";
  useEffect(() => {
    const localProjects = readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    setProjects(localProjects);
    exec(
      `osascript -e "tell application \\"Terminal\\"" -e "do script \\"cd \\" & \\"~/.config\\"" -e "activate" -e "end tell"`
    );
  }, []);

  const selectProject = (project: string) => {
    exec(`tms new-window -t ${directory}${project} -n ${project}`);
  };
  return (
    <List>
      {projects.map((project, index) => (
        <List.Item
          key={index}
          title={project}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action icon={Icon.Play} title={"Select"} onAction={() => selectProject(project)} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
